var NodeGraph = function ()
{
	this.vertices = [];
	this.edges = [];
};

NodeGraph.prototype.getVertex = function ($node)
{
	for (var i = 0, length = this.vertices.length; i < length; i += 1)
	{
		var vertex = this.vertices[i];
		if (vertex.node === $node)
		{
			return vertex;
		}
	}
};

NodeGraph.prototype.createVertex = function ($node)
{
	this.vertices.push({ node: $node });
};

NodeGraph.prototype.getVertexEdges = function ($vertex)
{
	var toReturn = [];
	for (var i = 0, length = this.edges.length; i < length; i += 1)
	{
		var edge = this.edges[i];
		if (edge.vertexA === $vertex || edge.vertexB === $vertex)
		{
			toReturn.push(edge);
		}
	}
	return toReturn;
};

// NodeGraph.prototype.connect = function ($ANode, $BNode)
// {
// 	var vertexA = this.getVertex($ANode) || this.createVertex($ANode);
// 	var vertexB = this.getVertex($BNode) || this.createVertex($BNode);

// 	for (var i = 0, length = this.edges.length; i < length; i += 1)
// 	{
// 		var edge = this.edges[i];
// 		if ()
// 	}
// };

module.exports = NodeGraph;
