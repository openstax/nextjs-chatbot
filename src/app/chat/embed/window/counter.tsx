'use client'

import { useState } from 'react'
import styled from '@emotion/styled'
const Header = styled.p({
  color: 'blue',
})

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Header>You clicked {count} times</Header>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
