type CallBack = (error: null | any, data: any) => void

// 原始使用 callback 套件的實例
const smb2 = {
  readDir: (path: string, cb?: CallBack) => {
    setTimeout(() => {
      cb && cb(null, `成功讀取檔案路徑: ${path}`)
    }, 1000)
  },
    
  writeDir: (path: string, file: string, cb?: CallBack) => {
    setTimeout(() => {
      cb && cb(null, `成功將檔案: ${file} 寫到路徑: ${path}`)
    }, 1000)
  },
}

// 原始套件使用方式
const demoHowToUseSmb2 = async () => {
  console.group('原始套件')

  smb2.readDir('/my/cool/dir', (error, readDirResult) => {
    console.log('原始套件 readDir 執行結果: ', readDirResult)
  })

  smb2.writeDir('/my/cool/dir', 'myCoolFile', (error, writeDirResult) => {
    console.log('原始套件 writeDir 執行結果: ', writeDirResult)
  })
  
  await new Promise((resolve) => {
    setTimeout(() => {
      console.groupEnd()
      resolve('')
    }, 2100)
  })
}

// 使用兩層 new Proxy 包裝成 Promise 形式的實例
const promiseSmb2 = new Proxy(smb2, {
  get: (target, prop, _proxy) => {
    return new Proxy(Reflect.get(target, prop), {
      apply: async (target, _thisArg, args) => {
        const data = await new Promise((resolve, reject) => {
          target(...args, (error, data) => {
            if (error) { return reject(error) }
            resolve(data)
          })
        })

        return data
      }
    })
  }
})

// 包裝成 promise 後的 callback 套件使用方式
const demoHowToUsePromiseSmb2 = async () => {
  console.group('包裝成 promise 後')

  const readDirResult = await promiseSmb2.readDir('/my/cool/dir')
  console.log('promise readDir 執行結果: ', readDirResult)

  const writeDirResult = await promiseSmb2.writeDir('/my/cool/dir', 'myCoolFile')
  console.log('promise writeDir 執行結果: ', writeDirResult)
  
  console.groupEnd()
}


const fn = async () => {
  await demoHowToUseSmb2()
  await demoHowToUsePromiseSmb2()
}

// 開始 demo
fn()
