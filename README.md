# INF219-AmalieSkram
Gruppeprosjekt i INF219 for Amalie Skram

## Making data available - Real data for students
This project was started by Amalie Skram high school in Bergen, Norge. 
Having the possibility to use "real data" for tasks and problems for the
students, they wanted to use the buoy Gabriel in Store Lungaardsvann and
its measurements, and making these measurements available to the students.

When this project was initiated, the database and data for a bit over a
existed. Amalie Skram high school asked for volunteers from the
University in Bergen to create their solution. A group of four students
picked up the offer, and using the project as a course in our studies.

What needed to be done was connecting the database to a user friendly 
environment for the students to use. The stack we ended up using was:

* **MongoDB** for DB (this was the database already up and running)
* **Node.js** for back-end
* **Jade Bootstrap** for front-end

While creating and testing the program, we have used Heroku to run the 
node.js application, and Mlab to host the database. Both of these 
services had free options suiting our needs well. In the end this is 
probably going to be hosted by the University in Bergen itself.

## This is the foundation (hopefully) of a bigger project
This project and this repository is hopefully the foundation of a bigger
project. There are monitoring stations like the buoy Gabriel many places,
everything from weather stations to drill holes in the mountains, where
data is measured, but not easily available for the public, or schools,
to use. These measurements, if saved in the same way, can hopefully use 
our code, probably needing some adjustments, but hopefully not many, to
make it available in the same way, in the same portal created here.


