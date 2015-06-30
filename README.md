#SVJelly
A library for turning a SVG file into a physically simulated scene.

###Work in progress
SVJelly is a work in progress and can be rough around the edges. The api is subject to break.
It is physics engine-agnostic but has a built-in 'physics renderer' working with P2js.
There is a built-in graphics renderer too, but interfacing the lib with your renderer should be easy.

##How to use it ?
Basically, the lib turns any SVG, weither you wrote it by hand or generated it from Illustrator or other vector drawing softwares that can export svg files (I couldn't test every program unfortunately) into a 'scene' on a canvas.

To make it easy for anyone to use the lib, there is a bundle named svjellymaker that will automatically load your svg or config file, create a canvas, set up the default renderers, add basic mouse controls etc.
The most basic usage is loading this bundle via a script tag and put an attribute name data-svjelly auto on that script tag. Once loaded, it will parse your page for any inline `<svg>` with an attribute named "data-svjelly", and transform that svg into a physical scene. You can optionally pass a config file as a value of the data-svjelly attribute.

If you don't want it to be automatic, juste create a canvas, and then call one of the loading functions of svjellymaker :
`window.svjellymaker.createFromURL(canvasElement, 'example.svg');`

See the examples for more advanced usage.

******

All your drawings, by default, will result in *non-physical* drawings on the canvas.

###Physical objects
The magic happens when you start giving keyword-based names to your objects or groups. This can be done in Illustrator by altering the name of your layers or groups, or by hand with the **ID attribute**.

The ID attribute of your svg element can be a simple keyword : **"metal"** or **"wood"** will turn your object into a moving object with the properties of the material you used as a keyword. (See built-in objects reference).

Soft bodies are included too. That means you can create trees, ropes, jelly, etc. That was the starting idea for the lib and that is where the name comes from.

You can either name the shape itself or a group containing various shapes, if you name a group containing several shapes, every shape will take the properties of the material you specified for the group.

The ID attribute can be of the form **"objectType-*objectIdentifier*"** : it lets you define a type for the object AND an identifier for later reference. This is important for constraints.

###Constraints
You create a constraint by putting the object you want to constrain in a group, and add an other polygonal shape that you will call **"constraint"** in the same group. There are two types of shapes you can use to constrain your object.

The first type is the line : A line will create a single constraint, tying your object to the world or to another object, the length of the line will determinate the length of the constraint.

The second object is the polygon shape. Think of it as a selection tool. Any of the anchors of your object that are overlapping with this vector shape will be constrained.

If you simply name it "constraint", your object will be tied to the world.
If you want your object to be attached to another object, name your constraint **"constraint-*otherObjectIdentifier*-*constraintType*"**.
ConstraintType specify the type of constraint you want to use. (See the constraint types reference).

If you want to specify a constraint type but want your object to be constrained to the world, just type **"constraint-world-*constraintType*"**.

###Joints
Joints behave like constraints, but they are the links that bond the nodes of a soft body together. You can use them to create for example muscles that you can control programmatically. They only work if you use a simple `<line>` connecting the two anchors you want to link. The syntax for the name of a joint is **"joint-*jointType*"** or simply **"joint"**

###Config file
You can fine-tune your objects or create new type of objects by creating a JSON config file with the properties of your objects and scene. See the config file reference or check out the examples to have an idea of what you can do with a config file.

###Limitations
For non-moving shapes, you are quite free to draw curves, gradients, strokes, circles, etc.

Moving shapes are more restrictive at the moment though.
They can only be simple paths with simple strokes. Curves are not supported apart from circles. Gradients on moving shapes are not supported yet apart from lines with gradients.

Opacity on groups is currently not supported

##Config file reference

- **worldWidth** : Specifies the physical width of your scene.
- **multiCanvas** : If true, the renderer will create multiple canvas for the layers of your scene. Helps improving performances.
- **debug** : If true, a debug view of your scene will be displayed.
- **gravity** : The gravitational force, represented as an array with two entries.
- **groups** : The properties of your physical objects. (See objects reference).
- **definition** : Definition of the canvas element. Fraction of 1.

##Built-in objects reference

- **metal** : Hard body
- **stone** : Hard body
- **wood** : Hard body
- **balloon** : Hard body, can lift other objects
- **tree** : Soft body, the mass of the nodes decrease the farer you go from the fixed points. The linking of the nodes composing the shape will be created by triangulation.
- **flora** : Basically the same as the tree object but for line drawings.
- **rubber** : A somewhat stiff soft body.
- **jelly** : A soft body whose structure is an hexagonal grid.
- **rope** : Another soft body that emulates a rope, the more nodes your line drawing have, the more ropey it will look.
- **static** : A hard body that doesn't move but will collide with other objects
- **noCollide** : A hard body whose collisions won't be registered. 
- **leaves** : A body that won't collide and can be useful to emulate leaves for the tree object.

##Built-in constraints reference
- **default** : Your object position will be locked to the other object or the world.
- **wire** : Your object will be attached to the world or other object with wires and will be able to rotate around its constraint.

##Future plans
- Motors, springs, built-in muscles etc.
- an option to have moving shapes with gradients
- "Decorations" for moving objects, stuff that is drawn but isn't involved into collisions.
-Advanced collision groups.
- BMP images with the svg `image` tag
- Pixi renderer based on sprites but I have yet to solve a fast way to include soft shapes in Pixi.
- A renderer with a viewport and a camera