const Node = (data, parent = null, right = null, left = null) => {
  return {
    data,
    parent,
    right,
    left,
  };
};

const Tree = (arr = [1, 2, 3, 4, 4, 5, 6]) => {
  const array = Array.from(new Set(arr)).sort((a, b) => a - b);
  const root = Node(array[Math.floor(array.length / 2)] || null);
  buildTree();

  function buildTree(i = 0, node = root) {
    // console.log(`${i}: ${array[i]} ~ current node ${node.data}`);
    if (i >= array.length) return;

    insert(array[i], node);

    return buildTree(i + 1);
  }

  function insert(value, node = root, parent = null) {
    if (!node) root = Node(value);
    if (value < node.data) {
      if (node.left) return insert(value, node.left, node);
      node.left = Node(value, node);
    }
    if (value > node.data) {
      if (node.right) return insert(value, node.right, node);
      node.right = Node(value, node);
    }
  }

  function includes(value, node = root) {
    if (!node) return false;
    if (node.data === value) return true;
    if (value < node.data) return includes(value, node.left);
    if (value > node.data) return includes(value, node.right);
  }
  function remove(value, node = root) {
    if (!node) return false;

    if (node.data === value) {
      const parent = node.parent;

      //root
      if (!parent) {
        if (!node.left && !node.right) root = null;
        if (!node.left) {
          let currentNode = node;
          while (currentNode.left) {
            currentNode = currentNode.left;
          }

          currentNode.parent.right = null;
          currentNode.parent = parent;
          parent.right = currentNode;
          currentNode.left = node.left;
          currentNode.right = node.right;
        }
      }

      //leaf node
      if (!node.left && !node.right) {
        if (node.data < parent.data) parent.left = null;
        else parent.right = null;
        return;
      }

      let currentNode = node;

      // node smaller than its parent
      if (value < parent.data) {
        let child = currentNode.right ? "right" : "light";
        while (currentNode[`${child}`]) {
          currentNode = currentNode[`${child}`];
        }

        // console.log(
        //   `arg ${value} ~ node ${node.data} ~ parent ${parent.data} ~ curr ${currentNode.data}`,
        // );
        // console.log(
        //   `arg ${value} ~ nodeleft ${node.left} ~ parentleft ${parent.left} ~ currleft ${currentNode.left}`,
        // );
        // console.log(
        //   `arg ${value} ~ noderight ${node.right} ~ parentright ${parent.right} ~ currleft ${currentNode.right}`,
        // );
        currentNode.parent[`${child}`] = null;
        currentNode.parent = parent;
        parent.left = currentNode;
        currentNode.left = node.left;
        currentNode.right = node.right;
      }
      // node larger than its parent
      if (value > parent.data) {
        let child = currentNode.left ? "left" : "right";
        while (currentNode[`${child}`]) {
          currentNode = currentNode[`${child}`];
        }

        currentNode.parent[`${child}`] = null;
        currentNode.parent = parent;
        parent.right = currentNode;
        currentNode.left = node.left;
        currentNode.right = node.right;
      }

      return;
    }

    if (value < node.data) return remove(value, node.left);
    if (value > node.data) return remove(value, node.right);
  }
  const prettyPrint = (node = root, prefix = "", isLeft = true) => {
    if (node === null || node === undefined) {
      return;
    }

    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  };

  return { prettyPrint, includes, insert, remove };
};

const bst = Tree();
bst.prettyPrint();
console.log(bst.includes(1));
console.log(bst.includes(6));
console.log(bst.includes(10));
console.log(bst.insert(10));
bst.prettyPrint();
console.log(bst.remove(1));
bst.prettyPrint();
