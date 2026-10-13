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
  let root = Node(array[Math.floor(array.length / 2)] || null);
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
  function deleteItem(value, node = root) {
    if (!node) return false;

    if (node.data === value) {
      const parent = node.parent;
      let currentNode = node;

      //root
      if (!parent) {
        if (!node.left && !node.right) return (root = null);

        //leaf node

        // no left child
        if (!node.left) {
          currentNode = node.right;
          while (currentNode.left) {
            currentNode = currentNode.left;
          }

          console.log(currentNode);
          currentNode.parent.left = null;
        }

        // left child
        else {
          currentNode = node.left;
          while (currentNode.right) {
            currentNode = currentNode.right;
          }

          currentNode.parent.right = null;
        }

        currentNode.parent = null;
        //check ciruclar bug
        let left =
          node.left && node.left.data === currentNode.data ? null : node.left;
        let right =
          node.right && node.right.data === currentNode.data
            ? null
            : node.right;
        currentNode.left = left;
        currentNode.right = right;

        if (currentNode.left) currentNode.left.parent = currentNode;
        if (currentNode.right) currentNode.right.parent = currentNode;
        root = currentNode;

        console.log(
          `currentNode data ${currentNode.data} parent data ${currentNode.parent?.data} currentNode left data ${currentNode.left?.data} currentNode right data ${currentNode.right?.data} `,
        );
        return;
      }

      //leaf node
      if (!currentNode.left && !currentNode.right) {
        if (currentNode.data < parent.data) parent.left = null;
        else parent.right = null;

        console.log(
          `LEAF: data ${currentNode.data} parent ${currentNode.parent?.data} left data ${currentNode.left?.data}  right data ${currentNode.right?.data} `,
        );
        return;
      }

      // left child only
      if (!node.right) {
        if (node.data < parent.data) parent.left = node.left || null;
        else parent.right = node.left || null;
        node.left.parent = parent;
        return;
      }

      // right child only
      if (!node.left) {
        if (node.data < parent.data) parent.left = node.right || null;
        else parent.right = node.right || null;

        node.right.parent = parent;
        return;
      }

      // node smaller than its parent
      if (value < parent.data) {
        let child = currentNode.right ? "right" : "light";
        while (currentNode[`${child}`]) {
          currentNode = currentNode[`${child}`];
        }

        currentNode.parent[`${child}`] = null;
        currentNode.parent = parent;
        parent.left = currentNode;
        currentNode.left = node.left;
        currentNode.right = node.right;
        currentNode.left.parent = currentNode;
        currentNode.right.parent = currentNode;

        console.log(
          `currentNode data ${currentNode.data} parent data ${currentNode.parent?.data} currentNode left data ${currentNode.left?.data} currentNode right data ${currentNode.right?.data} `,
        );
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
        currentNode.left.parent = currentNode;
        currentNode.right.parent = currentNode;
        console.log(
          `currentNode data ${currentNode.data} parent data ${currentNode.parent?.data} currentNode left data ${currentNode.left?.data} currentNode right data ${currentNode.right?.data} `,
        );
      }

      return;
    }

    if (value < node.data) return deleteItem(value, node.left);
    if (value > node.data) return deleteItem(value, node.right);
  }
  const prettyPrint = (node = root, prefix = "", isLeft = true) => {
    if (node === null || node === undefined) {
      return;
    }

    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  };

  function levelOrderForEach(callback = null, level = [root]) {
    if (level.length < 1) return;
    let nextLevel = [];
    level.forEach((item, i) => {
      if (item) {
        callback && callback(item);
        item.left && nextLevel.push(item.left);
        item.right && nextLevel.push(item.right);
      }
    });

    levelOrderForEach(callback, nextLevel);
  }

  function preOrderForEach(callback = null, node = root) {
    if (!callback) throw new Error("Invalid Arguments.");

    callback(node);

    if (node.left) preOrderForEach(callback, node.left);
    if (node.right) preOrderForEach(callback, node.right);
  }
  function inOrderForEach(callback = null, node = root) {
    if (!callback) throw new Error("Invalid Arguments.");

    if (node.left) preOrderForEach(callback, node.left);
    callback(node);
    if (node.right) preOrderForEach(callback, node.right);
  }
  function postOrderForEach(callback = null, node = root) {
    if (!callback) throw new Error("Invalid Arguments.");

    if (node.left) preOrderForEach(callback, node.left);
    if (node.right) preOrderForEach(callback, node.right);
    callback(node);
  }
  return {
    prettyPrint,
    includes,
    insert,
    deleteItem,
    levelOrderForEach,
    preOrderForEach,
    inOrderForEach,
    postOrderForEach,
  };
};

const bst = Tree();
bst.prettyPrint();
console.log(bst.includes(1));
console.log(bst.includes(6));
console.log(bst.includes(10));
console.log(bst.insert(10));
bst.prettyPrint();
// bst.levelOrderForEach(function (item) {
//   console.log(item.data);
// });

bst.preOrderForEach(function (item) {
  console.log(item.data);
});
bst.inOrderForEach(function (item) {
  console.log(item.data);
});
bst.postOrderForEach(function (item) {
  console.log(item.data);
});

// console.log(bst.deleteItem(5));
// console.log(bst.deleteItem(1));

// bst.prettyPrint();
// console.log(bst.deleteItem(10));
// console.log(bst.deleteItem(4));
// bst.prettyPrint();
// console.log(bst.deleteItem(3));

// bst.prettyPrint();
// console.log(bst.deleteItem(6));

// bst.prettyPrint();
// console.log(bst.deleteItem(2));

// bst.prettyPrint();
