--- TEST FIREFOX TODO, and think about shape of aduio control
author: garora
title: NoJS 2':' Random Boogaloo - Making a game with 'randomness' using pure HTML and CSS
categories:
  - Tech
layout: default_post
summary: Everyone loves CSS! Continuing in my obsession, I have created a tictactoe game, with an option to have a CPU that plays randommly. This was made without any javascript, only used HTML and CSS. In this blog post I discuss how I made it
category: Tech
image: garora/assets/2022-01-26/calc.png//CHNAGE TODO
---

This is part two to [this post](https://blog.scottlogic.com/2022/01/20/noJS-making-a-calculator-in-pure-css-html.html) where I explain how I made this pure CSS [calculator](https://quarknerd.github.io/noJS/calc.html). Next up I made [tictactoe](), which isn't in itself that an intersting extension, but the challenge came in adding a CPU to play "randommly". In this blog post I ~~make a case for my sanity~~ explain how I made it.

## Rules
The only thing I wrote was html and css. No HAML or SCSS or any other pre-processors. The no javascript is enforced by testing the app with javascript disabled by the browser. You can view my full codebase [here](https://github.com/QuarkNerd/noJS/).

## How did I make it?

### Basic game logic
In my previous blog post, I've explained how we can use radio buttons and labels to create the effect of buttons and state. This is pretty much all we need for the basic game.

Start off by creating the inputs

```html
<form>
  <input type="radio" id="X-1" name="1" />
  <input type="radio" id="X-2" name="2" />
  <!-- and so on for X-3 to X-9 -->
  <input type="radio" id="O-1" name="1" />
  <!-- and so on for O-2 to O-9 -->
</form>
```

Then each square of the game looks something like this

```html
<div class="board-square board-square-1">
  <label for="O-1"></label>
  <label for="X-1"></label>
  <div class="symbol-X">❌</div>
  <div class="symbol-O">⭕</div>
</div>
```

The first thing we need to do is ensure that the only label that can be clicked is the one corresponding to who's turn it is. We do this with

```css
  body:has(input:checked),
  body:has(input[id^="X"]:checked ~ input[id^="X"]:checked),
  /* more selectors for 3, 4 and 5 Xs*/
  {
    --has-x-just-played: 1;
  }

  body,
  body:has(input[id^="O"]:checked),
  body:has(input[id^="O"]:checked ~ input[id^="O"]:checked),
  /* more selectors for 4 and 5 Os*/
  {
    --has-x-just-played: 0;
  }

  label[for^="O"] {
    transform: scale(var(--has-x-just-played));
  }

```

The first 2 rulesets are used to a variable based on how many X's and O's have been selected. The `has` operator is a relatively new one. It allows you select parents based on children or select previous siblings based on upcoming siblings. In this case, the variable `--has-x-just-played` is always applied to the `body` element, this allows us to avoid a lot of nesting. The final ruleset hides any `label` connected to an O `input` when it is X's turn, so that the only clickable `label` is for X.

The simplest bit of the css logic is displaying the symbols, by default we set all symbols to `display: none` and then

```css
  /* display logic */
  body:has(#X-1:checked) .board-square-1 .symbol-X,
  body:has(#X-2:checked) .board-square-2 .symbol-X,
  /* ... */
  body:has(#O-1:checked) .board-square-1 .symbol-O,
  /* ... */
  {
      display: block;
  }
```

This rule could be simplified by moving each pair of `input`s to just before the corresponding square. That way the selectors could be made relative and only 2 would be needed. However I prefer to keep all inputs tightly together, this also makes the endgame logic slightly more concise.

Now we need some endgame logic

DOES THIS PART NEED EXPLAING? HOW
```css
body:has(input[id^="X"]:nth-of-type(3n-2):checked + input:checked + input:checked),
body:has(input[id^="X"]:checked + * + * + input:checked + * + * + input[id^="X"]:checked),
body:has(input#X-1:checked ~ input#X-5:checked ~ input#X-9:checked),
body:has(input#X-3:checked ~ input#X-5:checked ~ input#X-7:checked)
{
    --has-X-won: 1;
}

/* equivalent selectors for --has-O-won */

body:has(input:checked ~ input:checked ~ input:checked ~ input:checked ~ input:checked ~ input:checked ~ input:checked ~ input:checked ~ input:checked)
{
    --is-board-full: 1;
}

body {
  --is-game-over: max(var(--has-O-won), var(--has-X-won), var(--is-board-full));
  --is-game-on: calc(1 - var(--is-game-over));
  --has-drawn: calc(var(--is-game-over) - var(--has-X-won) - var(--has-O-won));
  
  --is-X-to-play: calc(var(--is-game-on)*(1 - var(--has-x-just-played)));
  --is-O-to-play: calc(var(--is-game-on)*var(--has-x-just-played));
}

```

Using the new variables `--has-X-won`, `--has-O-won` and `--has-drawn` we can display the result of the game. We can also change the O `label` scaling logic above to use `--is-O-to-play` and add an equivelent ruleset for X, so that the label become hidden when the game is over. A little bit of html and css is needed to move the squares into the right location, but there is nothing special here so I will skip over it. 

### Random

### Audio
If you've played the game you've probably noticed an audio easter egg. Before trying this I had thought that playing audio would require javascript to function, however the audio control works javascript disabled at the browser level so I'm going to allow it. 

The audio controls has many buttons (for volume, downloading ect). In order to only make the play button accessible, we first wrap it in a div and then apply the following css.
```css
.div-around-audio {
    height: 30px;
    width: 30px;
    border-radius: 20px;
    overflow: hidden;
}

.div-around-audio audio {
    position: absolute;
    top: -11px;
    left: -11px;
}
```

The key part is `overflow: hidden;` which ensures the overflow of the audio control cannot be interacted with, the rest of the values were determined by trial and error.

And then the play button can be made invisble or placed behind an element that has `pointer-events: none;`, which allows clicks to pass through it.

## Calculator Extension
Since making the calcultor, the `has` has been introduced, which allows selectoing parents based on children. In the cacluaotr this could be used to avoid the excessive nesting. REMOVE REPETIONS

There has salso been trig and stuff (exprimental), this could thortically open thegates for a scientific calculoro, but the main limtation to do this with calc limitis SOURCE

---- ADD STEPS with questin life choices joke
-- has and is
--- ask if specific code is needed for the audio things

## FAQ

#### When are you gonna stop?
Probably now

#### Did you write this blog post just so you could say the words "Random Boogaloo"?
No comment

#### Can you fix my CSS?
Have you tried turning it off and on again?

NOTES
Mentio  calc in summary?
image change
update question with correct titles
test audio in firefox with javscripit.
is it okay to ask people to read the previous post?
:has()
