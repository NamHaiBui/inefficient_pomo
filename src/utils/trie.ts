export class Trie {
    private root: TrieNode
  
    constructor() {
      this.root = new TrieNode()
    }
  
    insert(word: string): void {
      let node = this.root
      for (const char of word.toLowerCase()) {
        if (!node.children.has(char)) {
          node.children.set(char, new TrieNode())
        }
        node = node.children.get(char)!
      }
      node.isEndOfWord = true
    }
  
    search(prefix: string): string[] {
      const results: string[] = []
      let node = this.root
  
      // Traverse to the last node of the prefix
      for (const char of prefix.toLowerCase()) {
        if (!node.children.has(char)) {
          return results
        }
        node = node.children.get(char)!
      }
  
      // Use DFS to find all words with the prefix
      this.findAllWords(node, prefix, results)
      return results
    }
  
    private findAllWords(node: TrieNode, prefix: string, results: string[]): void {
      if (node.isEndOfWord) {
        results.push(prefix)
      }
  
      for (const [char, childNode] of node.children) {
        this.findAllWords(childNode, prefix + char, results)
      }
    }
  }
  
  class TrieNode {
    children: Map<string, TrieNode>
    isEndOfWord: boolean
  
    constructor() {
      this.children = new Map()
      this.isEndOfWord = false
    }
  }
  
  