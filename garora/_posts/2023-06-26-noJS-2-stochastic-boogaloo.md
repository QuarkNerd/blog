--- TEST FIREFOX TODO, and think about shape of aduio control
author: garora
title: NoJS 2':' Stochastic Boogaloo - Making a game with 'randomness' using pure HTML and CSS
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

DOES THIS PART NEED MORE EXPLAING?
```css
body:has(input[id^="X"]:nth-of-type(3n-2):checked + input:checked + input:checked), /* rows */
body:has(input[id^="X"]:checked + * + * + input:checked + * + * + input[id^="X"]:checked), /* columns */
body:has(input#X-1:checked ~ input#X-5:checked ~ input#X-9:checked), /* top-left to bottom-right diagonal */
body:has(input#X-3:checked ~ input#X-5:checked ~ input#X-7:checked), /* top-right to bottom-left diagonal */
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


<!-- pausing of animation- alos causes shrink issues
shadow has to be on outer thinkg becusase overflow hiiden
:has operator
grid is used to auto fill space -->
### Audio
If you've played the game you've probably noticed an audio easter egg. Before trying this I had thought that playing audio would require javascript to function, however the audio control works with javascript disabled at the browser level so I'm going to allow it. 

The audio controls has many buttons (for volume, downloading ect). In order to only make the play button accessible, we first wrap it in a div and then apply the following css.
```css
.div-around-audio {
    height: 30px;
    width: 30px;
    border-radius: 20px;
    overflow: hidden;
}

audio {
    position: absolute;
    top: -11px;
    left: -11px;
}
```

The key part is `overflow: hidden;` which ensures the overflow of the audio control cannot be interacted with, the rest of the values were determined by trial and error.

And then the play button can be made invisble or placed behind an element that has `pointer-events: none;`, which allows clicks to pass through it.

## Calculator Extension
Since making the calcultor, the `has` has been introduced, which allows selectoing parents based on children. In the calculator this could be used to avoid the excessive nesting. I also added basic trignometric functions, for this I followed the below steps

1. Use integer division (see pervious post) to create a modulo function and map the input to between 0 and 2π
2. Use a bunch of maths and retries to map the input to a value between 0 and π/2
3. Painfully implement the expansion series of trig functions
4. Realise that while I've been playing around with this, trig functiona have been added the spec
5. Question my life choices

Given the advances in the css spec to add trignometric and other mathmatical functions, writing a full scientific calculator is further within reach. While I have not yet attempted this, a possible limitation is that the [css spec](https://www.w3.org/TR/css-values-3/#calc-syntax) only asks browsers to support up to 20 terms in a `calc`, and while I haven't seen this exact limit in action, the main browsers do give up after a certain amount of complexity.

## FAQ

#### When are you gonna stop?
Probably now

#### Did you write this blog post just so you could say the words "Stochastic Boogaloo"?
No comment

## Wrap up
While I was making this , there were many points at which I deemed something to be 'impossible'. Things like functioning decimals; an evenly distributed 'random' selector; and functioning audio seemed out of scope for rules and format I had chosen. But because I had the freedom to stop and think about this with no deadline, I was able to overcome the challenges. When working with practical problems, we are faced with real-world pressures and time limits and this can often leave us with an incomplete view of the true power of the tech we work with. I encourage anyone with an interest to explore the limits of a technology and the power of their creativity. Maybe this will help you in your day to day job, but I wouldn't suggest rewriting any of your webapps in css only.

NOTES
image change
update question with correct titles
test audio in firefox with javscripit disabled.

Questions
Worth posting
is it okay to ask people to read the previous post?
all makes sense
should I use code when talking about how did trig
help with sentiment in last paragraph
