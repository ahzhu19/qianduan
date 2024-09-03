import { App, Directive } from 'vue'
import hljs from 'highlight.js'
import { ElMessage } from 'element-plus'

/**
 * 高亮代码
 * 插入行号、添加复制按钮、分片处理代码块，解决大数据量一次写入卡顿问题
 */

// 高亮代码
function highlightCode(block: HTMLElement) {
  hljs.highlightElement(block)
}

// 插入行号
function insertLineNumbers(block: HTMLElement) {
  const lines = block.innerHTML.split('\n')
  const numberedLines = lines
    .map((line, index) => {
      return `<span class="line-number">${index + 1}</span> ${line}`
    })
    .join('\n')
  block.innerHTML = numberedLines
}

// 添加复制按钮
function addCopyButton(block: HTMLElement) {
  const copyButton = document.createElement('i')
  copyButton.className = 'copy-button iconfont-sys'
  copyButton.innerHTML = '&#xe7b2;'
  copyButton.onclick = () => {
    navigator.clipboard.writeText(block.innerText).then(() => {
      ElMessage.success('复制成功')
    })
  }

  const preElement = block.parentElement
  if (preElement) {
    preElement.insertBefore(copyButton, block)
  }
}

// 处理单个代码块
function processBlock(block: HTMLElement) {
  highlightCode(block)
  insertLineNumbers(block)
  addCopyButton(block)
}

// 代码高亮、插入行号、复制按钮
const highlightDirective: Directive<HTMLElement> = {
  mounted(el: HTMLElement) {
    setTimeout(() => {
      const blocks = Array.from(el.querySelectorAll<HTMLElement>('pre code'))

      if (blocks.length <= 10) {
        // 如果代码块数量少于等于10，直接处理所有代码块
        blocks.forEach((block) => processBlock(block))
      } else {
        // 定义每次处理的代码块数
        const batchSize = 10
        let currentIndex = 0

        const processBatch = () => {
          const batch = blocks.slice(currentIndex, currentIndex + batchSize)

          batch.forEach((block) => {
            processBlock(block)
          })

          // 更新索引并继续处理下一批
          currentIndex += batchSize
          if (currentIndex < blocks.length) {
            // 使用 requestAnimationFrame 确保下一帧再处理
            requestAnimationFrame(processBatch)
          }
        }

        // 开始处理第一批代码块
        processBatch()
      }
    }, 200)
  }
}

export function setupHighlightDirective(app: App) {
  app.directive('highlight', highlightDirective)
}