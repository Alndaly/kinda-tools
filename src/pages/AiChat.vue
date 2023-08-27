<template>
  <q-page :style-fn='myTweak' class='q-pa-md flex column'>
    <div class='chat-box' ref='chatBox'>
      <div class='full-width'>
        <q-chat-message v-for='item in  messages ' :sent='item.sent' :key='item.id' :name='item.name'
          :avatar='item.avatar' :stamp='item.time ? differTime(item.time) : null'>
          <q-spinner-dots size="2rem" v-if="item.loading" />
          <div v-if="item.text">
            {{ item.text }}
          </div>
        </q-chat-message>
      </div>
    </div>
    <div class='q-pa-md row'>
      <q-form id='submitForm' @submit='onSendText' class='input-box row full-width'>
        <q-input outlined v-model='text' label='输入信息' style='flex: 1;'>
          <template v-if='text' v-slot:append>
            <q-icon name='cancel' @click.stop.prevent='onClearText' class='cursor-pointer' />
          </template>
        </q-input>
        <q-btn form='submitForm' flat icon='send' type='submit' />
      </q-form>
    </div>
  </q-page>
</template>
<script lang='ts' setup>
import { chat } from '@/services/ai'
import { nextTick, ref } from 'vue';
import { differTime } from '@/utils/time';

const text = ref('');
const chatBox = ref(null);
interface MessageItem {
  name: string,
  text?: string,
  avatar: string,
  loading: boolean,
  sent?: boolean,
  time?: number
}

const scrollToBottom = () => {
  chatBox.value && (chatBox.value.scrollTop = chatBox.value.scrollHeight)
}

const messages = ref<MessageItem[]>([]);

const onClearText = () => {
  text.value = ''
}

const aiStartThinking = async () => {
  messages.value.push({
    name: 'ai',
    loading: true,
    avatar: 'https://oss.kinda.info/image/202308212150138.PNG',
    text: ''
  })
  await nextTick();
  scrollToBottom();
}

const addMyMessage = async (text: string) => {
  const timeStamp = Date.now()
  messages.value.push({
    name: 'me',
    text: text,
    sent: true,
    loading: false,
    avatar: 'https://oss.kinda.info/image/202308212150138.PNG',
    time: timeStamp

  })
  await nextTick();
  scrollToBottom();
}

const aiStopThinking = () => {
  messages.value[messages.value.length - 1].loading = false
}

const myTweak = (offset: number) => {
  return { height: offset ? `calc(100vh - ${offset}px)` : '100vh' }
}

const onSendText = async () => {
  addMyMessage(text.value);
  text.value = '';
  const chat_task = chat({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: messages.value.map(item => {
      return {
        'role': item.sent ? 'user' : 'assistant',
        'content': item.text
      }
    })
  })
  aiStartThinking();
  const [res, err] = await chat_task;
  aiStopThinking();
  if (err) {
    const timeStamp = Date.now();
    messages.value[messages.value.length - 1].text = '出错啦，请重试'
    messages.value[messages.value.length - 1].time = timeStamp;
  }
  const reader = res.getReader();

  function processWord(chunk: any) {
    const text = new TextDecoder().decode(chunk);
    if (!text) return;
    const message = JSON.parse(text);
    if (message.choices[0].delta.finish_reason == 'stop') return;
    let aiMessage = messages.value[messages.value.length - 1]
    message.choices[0].delta.content && (aiMessage.text += message.choices[0].delta.content);
    messages.value[messages.value.length - 1] = aiMessage
    nextTick().then(() => scrollToBottom());
  }

  async function aiSaying() {
    const timeStamp = Date.now();
    messages.value[messages.value.length - 1].time = timeStamp;
    reader.read().then(({ done, value }: any) => {
      if (done) {
        console.log('Stream complete');
        return;
      }
      processWord(value)
      aiSaying();
    });
  }

  aiSaying();  // Start reading the stream
}
</script>
<style lang='scss'>
.chat-box {
  flex: 1;
  overflow: auto;

  .chat-box-container {
    border: 1px solid #ccc;
  }
}

.input-box {
  gap: 10px;
}
</style>
