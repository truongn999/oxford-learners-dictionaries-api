const cheerio = require("cheerio");
const request = require("request");
const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");

const fetchVerbs = (wiki) => {
  return new Promise((resolve, reject) => {
    axios
      .get(wiki)
      .then((response) => {
        const $$ = cheerio.load(response.data);
        const verb = $$("tr > td > p ").text();

        const lines = verb
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        const verbs = [];
        for (let i = 0; i < lines.length; i += 2) {
          if (verbs.includes({ type: lines[i], text: lines[i + 1] })) {
            break;
          }
          const type = lines[i];
          const text = lines[i + 1];
          if (type && text) {
            verbs.push({ id: verbs.length, type, text });
          } else {
            verbs.push();
          }
        }
        resolve(verbs);
      })
      .catch((error) => {
        resolve();
      });
  });
};

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/get-dictionary/:language/:entry", (req, res, next) => {
  const entry = req.params.entry;
  const slugLanguage = req.params.language;
  let nation = "us";

  if (slugLanguage === "en") {
    language = "english";
  } else if (slugLanguage === "uk") {
    language = "english";
    nation = "uk";
  } else if (slugLanguage === "en-vi") {
    language = "english-vietnamese";
  } else if (slugLanguage === "en-tw") {
    language = "english-chinese-traditional";
  }

  const url = `https://dictionary.cambridge.org/${nation}/dictionary/${language}/${entry}`;
  request(url, async (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      const siteurl = "https://dictionary.cambridge.org";
      const wiki = `https://simple.wiktionary.org/wiki/${entry}`;

      // get verbs

      const verbs = await fetchVerbs(wiki);
      
      // basic

      const word = $(".hw.dhw").first().text() || $(".di-title").first().text().trim();
      console.log((`Fetching word: ${word}`));
      
      const getPos = $(".pos.dpos") // part of speech
        .map((index, element) => {
          return $(element).text();
        })
        .get();
      const pos = getPos.filter(
        (item, index) => getPos.indexOf(item) === index,
      );
      

      // Phonetics audios
      const audio = [];
      for (const s of $(".pos-header.dpos-h")) {
        const posNode = s.childNodes.find(
          (c) =>
            c.attribs && c.attribs.class && c.attribs.class.includes("dpos-g"),
        );
        if (!posNode || posNode.childNodes.length === 0) continue;
        const p = $(posNode.childNodes[0]).text();
        const nodes = s.childNodes.filter(
          (c) =>
            c.name === "span" &&
            c.attribs &&
            c.attribs.class &&
            c.attribs.class.includes("dpron-i"),
        );
        if (nodes.length === 0) continue;
        for (const node of nodes) {
          if (node.childNodes.length < 3) continue;
          const lang = $(node.childNodes[0]).text();
          const aud = node.childNodes[1].childNodes.find(
            (c) => c.name === "audio",
          );
          if (!aud) continue;
          const src = aud.childNodes.find((c) => c.name === "source");
          if (!src) continue;
          const url = siteurl + $(src).attr("src");
          const pron = $(node.childNodes[2]).text();
          audio.push({ pos: p, lang: lang, url: url, pron: pron });
        }
      }

      // definition & example
      const exampleCount = $(".def-body.ddef_b")
        .map((index, element) => {
          const exampleElements = $(element).find(".examp.dexamp");
          return exampleElements.length;
        })
        .get();
      for (let i = 0; i < exampleCount.length; i++) {
        if (i == 0) {
          exampleCount[i] = exampleCount[i];
        } else {
          exampleCount[i] = exampleCount[i] + exampleCount[i - 1];
        }
      }

      const exampletrans = $(
        ".examp.dexamp > .trans.dtrans.dtrans-se.hdb.break-cj",
      ); // translation of the example
      const example = $(".examp.dexamp > .eg.deg")
        .map((index, element) => {
          return {
            id: index,
            text: $(element).text(),
            translation: exampletrans.eq(index).text(),
          };
        })
        .get();

      const source = (element) => {
        const defElement = $(element);
        const parentElement = defElement.closest(".pr.dictionary");
        const dataId = parentElement.attr("data-id");
        return dataId;
      };

      const defPos = (element) => {
        const defElement = $(element);
        const partOfSpeech = defElement
          .closest(".pr.entry-body__el")
          .find(".pos.dpos")
          .first()
          .text(); // Get the part of speech
        return partOfSpeech;
      };

      const getExample = (element) => {
        const ex = $(element)
          .find(".def-body.ddef_b > .examp.dexamp")
          .map((index, element) => {
            return {
              id: index,
              text: $(element).find(".eg.deg").text(),
              translation: $(element).find(".trans.dtrans").text(),
            };
          });
        return ex.get();
      };

      const definition = $(".def-block.ddef_block")
      .map((index, element) => {
        return {
          id: index,
          pos: defPos(element),
          source: source(element),
          text: $(element).find(".def.ddef_b.ddef_b-t").text(), // nghĩa tiếng Anh
          translation: $(element)
            .find("span.trans.dtrans") // nghĩa tiếng Việt
            .first()
            .text(),
          example: getExample(element),
        };
      })
      .get();


      // api response

      if (word === "") {
        res.status(404).json({
          error: "word not found",
        });
      } else {
        res.status(200).json({
          word: word,
          pos: pos,
          verbs: verbs,
          pronunciation: audio,
          definition: definition,
        });
      }
    }
  });
});

app.get("/api/get/:language/:entry", (req, res, next) => {
  const entry = req.params.entry;
  const slugLanguage = req.params.language || "english";

  const url = `https://www.oxfordlearnersdictionaries.com/definition/${slugLanguage}/${entry}_1`;
  request(url, async (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      const siteurl = "https://dictionary.cambridge.org";
      const wiki = `https://simple.wiktionary.org/wiki/${entry}`;

      // get verbs

      const verbs = await fetchVerbs(wiki);
      
      // basic

      const word = $(".headword").first().text().trim();
      const posMain = $(".pos").first().text().trim();
      const posMainText = posMain || null;
      if(!posMain) {
        const getPos = $(".pos") // part of speech
          .map((index, element) => {
            return $(element).text();
          })
          .get();
        const pos = getPos.filter(
          (item, index) => getPos.indexOf(item) === index,
        );
        posMainText = pos || null;
      }
      
      const getPos = $(".pos") // part of speech
        .map((index, element) => {
          return $(element).text();
        })
        .get();
      const pos = getPos.filter(
        (item, index) => getPos.indexOf(item) === index,
      );
      

      // Phonetics audios
      const audio = [];
      for (const s of $(".pos-header.dpos-h")) {
        const posNode = s.childNodes.find(
          (c) =>
            c.attribs && c.attribs.class && c.attribs.class.includes("dpos-g"),
        );
        if (!posNode || posNode.childNodes.length === 0) continue;
        const p = $(posNode.childNodes[0]).text();
        const nodes = s.childNodes.filter(
          (c) =>
            c.name === "span" &&
            c.attribs &&
            c.attribs.class &&
            c.attribs.class.includes("dpron-i"),
        );
        if (nodes.length === 0) continue;
        for (const node of nodes) {
          if (node.childNodes.length < 3) continue;
          const lang = $(node.childNodes[0]).text();
          const aud = node.childNodes[1].childNodes.find(
            (c) => c.name === "audio",
          );
          if (!aud) continue;
          const src = aud.childNodes.find((c) => c.name === "source");
          if (!src) continue;
          const url = siteurl + $(src).attr("src");
          const pron = $(node.childNodes[2]).text();
          audio.push({ pos: p, lang: lang, url: url, pron: pron });
        }
      }

      const us = $('.webtop .phons_n_am');
      const usMp3 = us.find('.pron-us').attr('data-src-mp3');
      const usPron = us.find('.phon').first().text().trim();

      // Lấy mp3 phát âm UK
      const uk = $('.webtop .phons_br');
      const ukMp3 = uk.find('.pron-uk').attr('data-src-mp3');
      const ukPron = uk.find('.phon').first().text().trim();

      const pronunciation = [];
      if (us) {
        pronunciation.push({
          pos: posMainText,
          type: "US",
          url: usMp3,
          pron: usPron,
        });
      }
      if (ukMp3) {
        pronunciation.push({
          pos,
          type: "UL",
          url: ukMp3,
          pron: ukPron,
        });
      }

      // definition & example
      const exampleCount = $(".def-body.ddef_b")
        .map((index, element) => {
          const exampleElements = $(element).find(".examp.dexamp");
          return exampleElements.length;
        })
        .get();
      for (let i = 0; i < exampleCount.length; i++) {
        if (i == 0) {
          exampleCount[i] = exampleCount[i];
        } else {
          exampleCount[i] = exampleCount[i] + exampleCount[i - 1];
        }
      }


      const results = [];

      $(".senses_multiple").find(".sense").each((index, element) => {
        const def = $(element).find(".def").first().text().trim(); // nghĩa tiếng Anh
        const examples = [];

        // Duyệt qua từng ví dụ <li> trong .examples
        $(element)
          .find(".examples > li")
          .each((i, li) => {
            const cfText = $(li).find(".cf").text().trim() || null;
            const xText = $(li).find(".x").text().trim() || null;

            if (xText) {
              examples.push({
                id: i,
                structured: cfText,
                text: xText,
              });
            }
          });

        results.push({
          definition: def,
          examples: examples,
        });
      });

      const idioms = [];

      $(".idm-g").each((index, element) => {
        const idiom = $(element).find(".idm").first().text().trim(); // Idiom chính
        const sense = $(element).find(".sense").first();

        // Lấy nhãn (nếu có)
        const label = sense.find(".labels").first().text().trim();
        const definition = sense.find(".def").first().text().trim();

        const definitionSub = label
          ? `${label} ${definition}`
          : definition;

        const examples = [];

        sense.find(".examples .x").each((i, ex) => {
          const text = $(ex).text().trim();
          if (text) {
            examples.push(text);
          }
        });

        idioms.push({
          definition: idiom,
          definitionSub,
          examples
        });
      });

      const phrasalVerbs = [];

      $(".phrasal_verb_links .pvrefs li").each((i, el) => {
        const text = $(el).text().trim();
        if (text) {
          phrasalVerbs.push(text);
        }
      });

      const resultOther = [];
      $("#relatedentries ul.list-col").first().find("li").each((_, el) => {
        const text = $(el).text().trim();

        // Nếu cuối chuỗi có từ loại như "noun", "verb", "adj", "adv", ...
        // thì tách phần cuối ra và bọc trong ()
        const parts = text.split(" ");
        if (parts.length > 1) {
          const last = parts.pop();
          const label = last.toLowerCase();
          const validPOS = ["noun", "verb", "adjective", "adj", "adverb", "adv", "pronoun", "preposition", "conjunction", "interjection"];
          if (validPOS.includes(label)) {
            resultOther.push(`${parts.join(" ")} (${last})`);
          } else {
            resultOther.push(text);
          }
        } else {
          resultOther.push(text);
        }
      });


      // api response

      if (word === "") {
        res.status(404).json({
          error: "word not found",
        });
      } else {
        res.status(200).json({
          word: word,
          pos: posMainText,
          verbs: verbs,
          pronunciation: pronunciation,
          translation: results,
          idioms: idioms,
          phrasalVerbs: phrasalVerbs,
          resultOther: resultOther,
        });
      }
    }
  });
});
module.exports = app;
