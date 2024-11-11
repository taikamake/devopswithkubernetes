
const createString = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const length = Math.floor(Math.random() * 10) + 1
    let output = ''
    for (let i = 0; i < length; i++) {
        output += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return output
}

const output = createString()
console.log(new Date().toLocaleString() + ': ' + output)
setInterval(() => {
    console.log(new Date().toLocaleString() + ': ' + output)
}, 5000);