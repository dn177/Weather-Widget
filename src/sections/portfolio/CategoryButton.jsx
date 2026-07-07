const CategoryButton = ({ category, techKey, className, onChangeCategory, techColor, isActive }) => {
  const buttonStyle = {
    '--tech-color': techColor || '#6b7280'
  };

  return (
    <button
      className={className}
      onClick={() => onChangeCategory(techKey)}
      style={buttonStyle}
      aria-pressed={isActive}
    >
      {category}
    </button>
  )
}

export default CategoryButton
