Nidhi Doshi (npdoshi)
Dhaval Shah (dhavals)
Won-Gu Kang (wonguk)

Our game is essentiall the classic game of Pong. There is a 1 player as well as a 2 player mode. In a 1 player mode, use the arrow keys to control the paddle. In a 2 player mode, you may use W and S keys for the left hand side player, with the option of a mouse for the right hand side player. 

The objective of the game is to try and get the puck (yellow) to beat the opposing player. 
The first player to reach 15 points wins the game. 

We have included powerups as well -- so that if a certain powerup is consumed by a player, his paddle size increases for a short duration of time, thereby making his gameplay easier.


CODE:

In the code, we have included first class functions to elegantly program different behaviour of the ball reacting to a bounce. In our intro screen, the balls bounce off all four walls, and in our actual game, only the top and bottom walls support a bounce. This has also been extended for the powerups, since they bounce off two sides as well -- but disappear after some time, and then reappear again.

Our object model is fairly straightforward. We have a MovingCircle superclass (if we can say so), and Ball and PowerUp sub-classes extending MovingCircle. MovingCircle holds basic information needed to make a circular shape move on our canvas, whereas Ball and PowerUp hold specific details relevant only to those objects.

We hope you enjoy playing our game!