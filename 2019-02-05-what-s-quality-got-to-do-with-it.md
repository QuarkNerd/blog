---
published: true
author: efiennes
layout: default_post
category: Testing
title: What's quality got to do with IT?
summary: >-
  What is quality in a modern development team? Is it a set of best practices, a
  mindset, a certification or a mix of all these. In a career of over 20 years
  in IT, I have seem some weird and wonderful use of the quality label. I've
  also defined for myself what quality is in an agile context. Interested? Read
  on.
tags: 'testing, development, quality, featured'
image: efiennes/assets/Stop.png
---
This is the full version of my talk for the [Agile roundabout](https://www.meetup.com/The-QE-Roundabout/events/255548308/) last November. If you are a London based member of a delivery team, do yourself a favour and sign up to this amazing group for the oppertunities to hear some amazing talks. If you fancy dipping your toes into the world of public speaking, the organisers are really welcoming - reach out to [them](https://twitter.com/agileroundabout).


![Intro1.png]({{site.baseurl}}/efiennes/assets/Intro1.png)

My first "quality" role was a painful and funny process. The organisation I was a part of made the decision to off-shore all our testing. The team that had been responsible for testing was now responsible for "the quality". Whatever that was. In all the rush to off-shore and redefine roles, someone forgot to actually specify what shape this being responsible for quality actually took.


"You!, you did the testing, testing is a part of quality, you now own the quality" was the outcome of a conversation with my line manager. If he knew what this quality thing was, he was hiding it like a chamption. 



![QA2.png]({{site.baseurl}}/efiennes/assets/QA2.png)

So we got in a Quality Specialist who wrote reams and reams of documnentation. This new world of quality was the responsibility of one team (which ultimately ended up being me!) and very process heavy. Somehow a decade in testing had prepared me for this new unspecified role, so that was all right then. (Internal screaming noises). 

I read those quality tomes in which everything was documented to the nth degree in yawn-inducing detail about best practices and related industry certifications. The process flowcharts I inherited had subflowcharts! Needless to say, most of these intricate processes were out of date as soon as they were written.

My first date with quality was not a success. Never mind swiping right, I would have turned off the phone if I had seen what the future had in store!



![What3.png]({{site.baseurl}}/efiennes/assets/What3.png)

I decided to do some research of my own on what this quality thing was. The good thing about this was that I realised I was not alone. A lot of people were starting to talk about the quality dynamic in delivery teams and how that should be defined in any given method of delivery. This was resulting in a lot of debate but not many conclusions.

My conclusion was that I was not the only one confused as to what this esoteric thing called quality actually was in actionable terms. On blogs, in books, in whitepapers I found arguments that quality was all of these and none of these



![Where4.png]({{site.baseurl}}/efiennes/assets/Where4.png)

Since a lot of the coversations that were going on were centered around what quality was NOT. (Quality is not testing) - I decided to do some research on the history of quality to see if the past could give me some clues about what quality should be.

Maybe looking at the history of systems / software QA would help me understand it.
The earliest examples of thinking about quality came from a 1931 book called "Economic control of quality of manufactured product" by Walter Shewhart. In it, he talks about the justification and value of quality controls in factory environments. This was good but it related to a physical activity which might mean a lack of crossover lessons about quality.

In his 1950 paper ‘On Checking a Large Routine’ -  Alan M. Turing proposes how to check a routine to make sure that it is fit for purpose. This was more like it. Turing did not just stop there, he also forecast the progress of modern software developmenr with his prediction that "a programming language
(will go on to form) a sort of symbolic logic". So now I have 2 critreria for quality - checking and future-facing. The man was a genius. It is a pity that the state could not see his intrinsic value as a human being and went down a path of prosecuting him rather than encouraging and funding him. It is ridiculous, time-wasting, madness and stupid on the part of any country to persecute people for the way they are born. There are so many other good things more worthy of time and energy.

So far, so concentrating on the product but all that was about to change with the 1951 publication of 'Total Quality Control' by Armand Feigenbaum. A volume that defines quality as a customer outcome. 
The only measure of quality worth taking was a satisfied customer and the responsibility for this sits with everyone in a company. Now THIS felt like something that could be actionable.

In 1961, Gerald Weinberg would publish "Computer Programming Fundamentals". For anyone still wondering about the role of testing as part of delivering quality, that book contained a chapter on software testing. 
“Testing should prove the adaptability of a program instead of its ability to process information”. There you go, an unbreakable definition of testing. It's nothing to do with QA or assurance, it's to ensure adaptability.



![Who5.png]({{site.baseurl}}/efiennes/assets/Who5.png)

I could not talk about quality without bringing Margaret Hamilton into the conversation. For her self-testing code, she gets a dedicated slide and lots of hearts all to herself.

Hamilton is an innovater in systems design and software development, enterprise scaling and process modelling, development paradigms, formal systems modelling languages, system-oriented objects for systems modelling and development, automated life-cycle environments, software reliability, software reuse, domain analysis, correctness by built-in language properties, open architecture techniques for robust systems, full life-cycle automation, seamless integration, error detection and recovery, man-machine interface systems, operating systems, end-to-end testing and life-cycle management. 

She's the living, breathing, walking, talking definition of quality!



![Decade6.png]({{site.baseurl}}/efiennes/assets/Decade6.png)

I had a bit of a think about how I had seen quality talked about and practiced over the last 20 years and decided that I really had never seen it done properly in waterfall. Too much of a reliance on artefacts and standards that may not be applicable to the context in which it was applied. QA in waterfall software development was an old-fashioned idea associated with process heavy CMMi, TMMi, ISO, ISEB (ISTQB) and whole other lists of acronyms.

New engaged agile was nothing to write home about regarding quality practices either.  Worringly, the [agile manifesto](https://agilemanifesto.org/) did not mention quality as one of its core tenants. 

It is hard to relate quality to modern lean agile ways of thinking around solution delivery. Some agile ways of working can also leave a quality gap that causes pain and delays for teams that want to deliver at speed.



![ANTIPA.png]({{site.baseurl}}/efiennes/assets/ANTIPA.png)

Quality anti-patterns are the short-term things that are done to aid delivery but through accident or intention actually become barriers to medium or long term delivery.

Only hiring experienced agilists into your teams is a quality risk as you may limit the perspectives and the experience that a diverse team can bring to a development team. 17 signatories to the agile MANifesto and none of them thought to include quality in their considerations. Maybe it's time for a WOMANifesto, one that considers quality as part of the delivery process.



![That6.png]({{site.baseurl}}/efiennes/assets/That6.png)

With all this research, I now had to decide on what quality was based on my understanding of the work of the trailblazers and my own 2 decades in delivery. This was the conclusion I came to. It's verbose but I am ok with that.
Quality is the right features / programs...
	being delivered in the right way at the right time...
    	by a content team who understand their user / customer base...
        	confident they are doing the right activity at any given point...
            	As a bonus, it should be inheritable and repeatable.
                
This is taking the stance that quality is something Agile, Waterfall and mixed delivery teams can introduce and encourage. Therefore it is a dynamic and a mindset.



![Thethings7.png]({{site.baseurl}}/efiennes/assets/Thethings7.png)

Technology and delivery have changed a lot since the days of Turning and Hamilton. We now have more stuff to consider than those pioneers ever envisaged. More home devices connected to the internet, a more diverse set of users and more local and geological considerations to take into account.

We now have to think about our software in terms of the demographics of our users, the devices they will be using, the quality of the internet they have, how they get their internet. Fact: Googles next 1 billion users will probably be on 2nd or 3rd hand devices on PAYG internet in devleoping countries. They cannot develop for a London user on fast home internet and a customer in a developing country on a 3g phone in the same way. We cannot test for these users in the same way either. 

Considering quality as part of your delivery process means a consideration of every part of the software development lifecycle. This means considering everything from the design of the solution on paper to the feedback from the customer and everything inbetween.



![TheGirls8.png]({{site.baseurl}}/efiennes/assets/TheGirls8.png)

I hope I have managed to give you the message that quality is about so much more than development, testing and business analysis - it is the sum of all the parts of the team INCLUDING the team. Here are some quality trailblazers who set the world on fire with their forward thinking attitude to quality.

Annie Easley - an actual freaking rocket scientist. Qualified to say "actually it's not rocket science". Her research on battery life and how to manage it programatically is the foundation for electric car engine power management today. Not bad for a women who once had to pass a literacy test in order to vote. So future facing, she was writing the future rather than speculating on it. 

Could you imagine going to work one day and being told you had to sit at "that table" while the proper engineers got to sit at the engineers table. Even though you did the same job to the same level of quality. The only justification for you not having a place at THE table was a characteristic you were born with. Imagine knowing that you were working with the smartest people in the land and they still insisted that it was ok to treat you like this?

How would that make you feel? Like fleeing or fighting? [Miriam Mann](https://www.newscientist.com/article/2118526-when-computers-were-human-the-black-women-behind-nasas-success/) decided to fight. Every day she came to work and removed the “Colored Computers” sign that relegated the black women of West Computing to a lone rear table away from the "proper" engineers. Making members of your team feel like shit because of who they are is not ok. That's a bad thing. If you do bad things, there will be more bad things. Don't do them. 



![Badsolution9.png]({{site.baseurl}}/efiennes/assets/Badsolution9.png)

Ok, now we have an idea of what quality is and what the anti-patterns are, we need to talk about who does the quality (and how). Traditionally there have been 2 approaches to quality ownership: single and distributed ownership.

In older fashioned dev teams and larger enterprise environments, the Quality dynamic is left to  one person – the "QA manager”. This person is typically reactive running around like a Tazmanian devil. The Jackie of all trades, master of none. The octopus with tentacles in everything who has not got the time or the depth of understanding to drive change at the right level. It's no accident that they like tracking and metrics. However, the production of those metrics are of no benefit to anyone in the delivery teams and dare I say it... only serve as a justification of the role of the QA manager. (Yep, I dared)



![BadSolution10.png]({{site.baseurl}}/efiennes/assets/BadSolution10.png)

The other side of quality is leaving it to the team on the basis that we are all cross-functional now. Assuming quality will just happen is like assuming that development “will just happen” if your t-shaped skills are BA, Tester and Scrum master. Quality is not like magic, if it were Heronime Grainger would be its poster child. 

The challenge with the idea of a team taking care of quality is that there is no concept of Quality being baked into the role of anyone or everyone. It is “assumed” that if everyone is t-shaped, this just makes the quality happen.

This is not a Harry Potter novel, quality is not magic, it doesn't "just happen" because you throw some of its characteristics into a cauldron. It has to be less abstract than that.



![Solution11.png]({{site.baseurl}}/efiennes/assets/Solution11.png)

Burgeoning Agile teams parachute in Scrum masters to teach teams how to hone their Agile practices and train up other Scrum masters in their wake. There is a similar role needed for the QA dynamic too. 

This would involve extensive coaching of a team in quality dynamics and practices. The coach would then leave behind a leader of the Quality dynamic who is reactively supported day to day and proactively looking to the future every week, month and year


![Outcomes12.png]({{site.baseurl}}/efiennes/assets/Outcomes12.png)

This means that QA as is thought of as a dynamic AND a mindset that is bought into by everyone on a delivery team.
 
The quality role will become a pre-emptive training / influencing / mentoring role rather than a reactive “too slow, too many bugs, too many environment outages, too little unit testing, too many unclear requirements”... role.


![Solution12.png]({{site.baseurl}}/efiennes/assets/Solution12.png)

As a result of this mindshift, all members in delivery teams add a new dimension to their focus. This means shifting from being t-shaped to being star shaped with a quality focus making up the new facet of team focus and perspective.
