const CategoryButton = ({ category, techKey, className, onChangeCategory, isActive }) => {
  return (
    <button
      className={className}
      onClick={() => onChangeCategory(techKey)}
      aria-pressed={isActive}
    >
      {category}
    </button>
  )
}

export default CategoryButton
