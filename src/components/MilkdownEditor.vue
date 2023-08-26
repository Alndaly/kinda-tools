<!-- MilkdownEditor.vue -->
<template>
  <Milkdown />
</template>

<script setup lang="ts">
import {
  useNodeViewFactory,
} from '@prosemirror-adapter/vue';
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { Milkdown, useEditor } from '@milkdown/vue';
import { $view } from '@milkdown/utils';
import CodeNode from '@/components/plugins/code-node/CodeNode.vue';
import {
  codeBlockSchema,
  commonmark,
} from '@milkdown/preset-commonmark';
import { kindaThemeConfig } from '@/components/plugins/editor-theme-kinda';
import { prism } from '@milkdown/plugin-prism';
import { history } from '@milkdown/plugin-history';
import { clipboard } from '@milkdown/plugin-clipboard';
import { gfm } from '@milkdown/preset-gfm';
import { math } from '@milkdown/plugin-math';
import { editorViewOptionsCtx } from '@milkdown/core';

import 'prosemirror-view/style/prosemirror.css';
import 'prism-themes/themes/prism-nord.css';
import 'katex/dist/katex.min.css';

const nodeViewFactory = useNodeViewFactory();

const editable = () => true;

useEditor((root) =>
  Editor.make()
    .enableInspector()
    .config((ctx) => {
      ctx.set(rootCtx, root);
      ctx.set(defaultValueCtx, '');
      ctx.update(editorViewOptionsCtx, (prev) => ({
        ...prev,
        editable,
      }));
    })
    .config(kindaThemeConfig)
    .use(commonmark)
    .use(gfm)
    .use(prism)
    .use(history)
    .use(clipboard)
    .use(math)
    .use(
      $view(codeBlockSchema.node, () =>
        nodeViewFactory({ component: CodeNode })
      )
    )
);
</script>
