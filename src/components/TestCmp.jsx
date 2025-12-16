import React from 'react'

const getMessage = () => new Promise(resolve => {
    setTimeout(() => {
        resolve("Hello world")
    }, 400);
})
export default async function TestCmp({ extra }) {
    const text = await getMessage()
    return (
        <div>
            <p className='text-red-500'>{text} {extra}</p>
        </div>
    )
}
