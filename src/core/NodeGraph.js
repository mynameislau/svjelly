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
	var vertex = { node: $node };
	this.vertices.push(vertex);
	return vertex;
};

NodeGraph.prototype.getEdgeWeight = function ($edge)
{
	var dX = Math.abs($edge.vertexA.node.oX - $edge.vertexB.node.oX);
	var dY = Math.abs($edge.vertexA.node.oY - $edge.vertexB.node.oY);
	var dist = Math.sqrt(dX * dX + dY * dY);
	return dist;
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

NodeGraph.prototype.connect = function ($ANode, $BNode)
{
	var vertexA = this.getVertex($ANode) || this.createVertex($ANode);
	var vertexB = this.getVertex($BNode) || this.createVertex($BNode);

	var exists = false;
	for (var i = 0, length = this.edges.length; i < length; i += 1)
	{
		var edge = this.edges[i];
		if ((edge.vertexA === vertexA &&
			edge.vertexB === vertexB) ||
			(edge.vertexA === vertexB &&
			edge.vertexB === vertexA))
		{
			exists = true;
		}
	}
	if (!exists)
	{
		this.edges.push({ vertexA: vertexA, vertexB: vertexB });
	}
};

NodeGraph.prototype.traverse = function ($startingVertices)
{
	var i;
	var openList = [];
	var edgesLength;
	var vertexEdges;
	var startingVerticesLength = $startingVertices.length;
	for (i = 0; i < startingVerticesLength; i += 1)
	{
		$startingVertices[i].mapValue = 0;
		$startingVertices[i].opened = true;
		openList.push($startingVertices[i]);
	}

	while (openList.length)
	{
		var closedVertex = openList.shift();
		closedVertex.closed = true;

		vertexEdges = this.getVertexEdges(closedVertex);
		edgesLength = vertexEdges.length;
		for (i = 0; i < edgesLength; i += 1)
		{
			var currEdge = vertexEdges[i];
			var otherVertex = currEdge.vertexA === closedVertex ? currEdge.vertexB : currEdge.vertexA;
			if (otherVertex.closed) { continue; }
			
			if (!otherVertex.opened)
			{
				otherVertex.opened = true;
				openList.push(otherVertex);
			}
			var val = closedVertex.mapValue + this.getEdgeWeight(currEdge);
			otherVertex.mapValue = otherVertex.mapValue < val ? otherVertex.mapValue : val; //works even if undefined
		}
	}
};

module.exports = NodeGraph;
