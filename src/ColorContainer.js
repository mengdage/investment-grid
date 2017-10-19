import React from 'react'
import './ColorContainer.css'
import { getColors } from './utils'

export default class ColorContainer extends React.Component {

  render() {
    const {levels, hexColor} = this.props
    const colors = getColors(levels, hexColor)

    const colorBlocks = colors.map( c => (<div key={c} className='block' style={{backgroundColor: c}}/>) )
    return (
      <div
        className='block-container'
        >
        {colorBlocks}
      </div>

    )


  }


}
