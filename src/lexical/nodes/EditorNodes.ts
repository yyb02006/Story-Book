import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { KlassConstructor, LexicalNode, LexicalNodeReplacement, TextNode } from 'lexical'
import { CodeHighlightNode } from '@lexical/code'
import { LinkNode } from '@lexical/link'
import { StickyNode } from '#/lexical/nodes/StickyNode'
import { ImageNode } from '#/lexical/nodes/ImageNode'
import { ExtendedTextNode } from '#/lexical/nodes/extendedTextNode'
import { ExtendedCodeNode } from '#/lexical/nodes/extendedCodeNode'

//
// Klass<T> : 제네릭 T 타입의 클래스의 인스턴스를 생성할 수 있는 클래스만 허용하는 유틸리티 타입
//
export const nodes:
  | readonly (KlassConstructor<typeof LexicalNode> | LexicalNodeReplacement)[]
  | undefined = [
  ExtendedTextNode,
  {
    replace: TextNode,
    with: (node: TextNode) => new ExtendedTextNode(node.__text),
    withKlass: ExtendedTextNode,
  },
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  ExtendedCodeNode,
  CodeHighlightNode,
  LinkNode,
  StickyNode,
  ImageNode,
]
