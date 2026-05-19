import React from 'react'

const CategoryButton = ({ category, className, onChangeCategory, techColor }) => {
  const buttonStyle = {
    '--tech-color': techColor || '#6b7280'
  };

  return (
    <button 
      className={className} 
      onClick={() => onChangeCategory(category)}
      style={buttonStyle}
    >
      {category}
    </button>
  )
}

export default CategoryButton