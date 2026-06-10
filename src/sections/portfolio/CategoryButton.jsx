const CategoryButton = ({ category, className, onChangeCategory, techColor, isActive }) => {
  const buttonStyle = {
    '--tech-color': techColor || '#6b7280'
  };

  return (
    <button
      className={className}
      onClick={() => onChangeCategory(category)}
      style={buttonStyle}
      aria-pressed={isActive}
    >
      {category}
    </button>
  )
}

export default CategoryButton
