# Oxford learner's dictionaries API

A simple API for [Oxford learner's dictionaries](https://www.oxfordlearnersdictionaries.com/), built with Node.js.

<a href="https://www.buymeacoffee.com/truongnguyendev"><img src="https://img.buymeacoffee.com/button-api/?text=By me a coffee&emoji=&slug=truongnguyendev&button_colour=8c2eff&font_colour=ffffff&font_family=Arial&outline_colour=ffffff&coffee_colour=FFDD00" /></a>

## 🕹️ Manual

### 📚️ dictionary

api/get/`{language}`/`{word}`

#### **language option:**

| option       |         description         |
| -----------  | :-------------------------: |
| **`english`**|        english (us)         |

**use `/` to test it with UI**

## 🌐 Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/truongn999/oxford-learners-dictionaries-api/)

## 💻 Running Locally

After clone this repository, run the following commands in the repository floder:

```bash
# install dependencies
pnpm install
# run
pnpm run dev
```

Then fetch `http://localhost:4000/api/get/english/hello` to test it
or use / to test it out with UI.

## 📖 Example

/api/get/`english`/`cook`

```json
{
  "word": "cook",
  "pos": "verb",
  "verbs": [
    {
      "id": 0,
      "type": "Plain form",
      "text": "cookThird-person singular"
    },
    {
      "id": 1,
      "type": "cooksPast tense",
      "text": "cookedPast participle"
    },
    {
      "id": 2,
      "type": "cookedPresent participle",
      "text": "cookingSingular"
    },
    {
      "id": 3,
      "type": "cookPlural",
      "text": "cooks"
    }
  ],
  "pronunciation": [
    {
      "pos": "verb",
      "type": "US",
      "url": "https://www.oxfordlearnersdictionaries.com/media/english/us_pron/c/coo/cook_/cook__us_1.mp3",
      "pron": "/kʊk/"
    },
    {
      "pos": [
        "verb",
        "noun"
      ],
      "type": "UL",
      "url": "https://www.oxfordlearnersdictionaries.com/media/english/uk_pron/c/coo/cook_/cook__gb_3.mp3",
      "pron": "/kʊk/"
    }
  ],
  "translation": [
  {
    "definition": "to prepare food by heating it, for example by boiling, baking or frying it",
    "examples": [
      {
      "id": 0,
      "structured": null,
      "text": "Where did you learn to cook?"
      },
      {
      "id": 1,
      "structured": null,
      "text": "Add the onion and cook for three minutes."
      },
      {
      "id": 2,
      "structured": "cook something",
      "text": "to cook a meal"
      },
      {
      "id": 3,
      "structured": null,
      "text": "to cook food/dinner"
      },
      {
      "id": 4,
      "structured": null,
      "text": "What's the best way to cook trout?"
      },
      {
      "id": 5,
      "structured": null,
      "text": "I always have a cooked breakfast (= consisting of cooked food)"
      },
      {
      "id": 6,
      "structured": "cook something for somebody",
      "text": "He cooked lunch for me."
      },
      {
      "id": 7,
      "structured": "cook somebody something",
      "text": "He cooked me lunch."
      }
    ]
  },
  {
    "definition": "to be prepared by boiling, baking, frying, etc.",
    "examples": [
    {
      "id": 0,
      "structured": null,
      "text": "While the pasta is cooking, prepare the sauce."
    },
    {
      "id": 1,
      "structured": null,
      "text": "Turn the fish over so that it cooks evenly."
    }
    ]
  },
  {
    "definition": "to be happening or planned",
    "examples": [
      {
      "id": 0,
      "structured": null,
      "text": "Everyone is being very secretive—there's something cooking."
      }
    ]
  }
  ],
  "idioms": [
    {
      "definition": "be cooking with gas",
      "definitionSub": "(informal) to be doing something very well and successfully",
      "examples": []
    },
    {
      "definition": "cook the books",
      "definitionSub": "(informal) to change facts or figures dishonestly or illegally",
      "examples": [
        "His accountant had been cooking the books for years.",
        "Someone was cooking the books."
      ]
    },
    {
      "definition": "cook somebody's goose",
      "definitionSub": "(informal) to destroy somebody's chances of success",
      "examples": []
    }
  ],
  "phrasalVerbs": [
    "cook up"
  ],
  "resultOther": [
    "cook (noun)",
    "cook up",
    "Beryl Cook",
    "Peter Cook",
    "Robin Cook",
    "cook-chill (adjective)",
    "pastry cook (noun)",
    "Captain Cook",
    "Thomas Cook",
    "short-order cook (noun)",
    "pastry cook",
    "cook something  up",
    "cook the books",
    "cook, dance, etc. up a storm"
  ]
}
```

## Support me 🎉

Hi there, I'm Truong Nguyen Nhut (aka Skun) — a passionate Frontend & Mobile Developer.
This API was originally built for one of my personal projects that's still in development. I never expected it to gain so much attention from the community — and I'm truly grateful for that!

If you find it helpful, please consider supporting me.
Your sponsorship helps cover server and database costs, and allows me to keep building more useful tools and open-source projects in the future.

Thank you so much for your love and support ❤️

<a href="https://www.buymeacoffee.com/truongnguyendev"><img src="https://img.buymeacoffee.com/button-api/?text=By me a coffee&emoji=&slug=truongnguyendev&button_colour=8c2eff&font_colour=ffffff&font_family=Arial&outline_colour=ffffff&coffee_colour=FFDD00" /></a>

## API Source

- Verbs from [wiktionary](https://www.wiktionary.org/)
- Other data from [Oxford learner's dictionaries](https://www.oxfordlearnersdictionaries.com/)

Develop by Skun ❤️ \
Contributions are welcome! 🎉
