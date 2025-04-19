import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { Klass, LexicalNode } from 'lexical'
import { CodeNode, CodeHighlightNode } from '@lexical/code'

//
// Klass<T> : 제네릭 T 타입의 클래스의 인스턴스를 생성할 수 있는 클래스만 허용하는 유틸리티 타입
//
export const nodes: Klass<LexicalNode>[] = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  CodeNode,
  CodeHighlightNode,
]
