import React from 'react';
import './FoodLoadingAnimation.css';

const FoodLoadingAnimation = ({ 
  size = 'medium', 
  text = 'Loading delicious data...', 
  fullScreen = false,
  type = 'default' 
}) => {
  const getAnimationType = () => {
    switch(type) {
      case 'utensils':
        return <UtensilsAnimation size={size} />;
      case 'plates':
        return <PlatesAnimation size={size} />;
      case 'chef':
        return <ChefAnimation size={size} />;
      case 'ingredients':
        return <IngredientsAnimation size={size} />;
      default:
        return <UtensilsAnimation size={size} />;
    }
  };

  const containerClass = fullScreen ? 'food-loading--fullscreen' : 'food-loading--inline';

  return (
    <div className={`food-loading ${containerClass}`}>
      <div className="food-loading__content">
        {getAnimationType()}
        {text && <p className="food-loading__text">{text}</p>}
      </div>
    </div>
  );
};

const UtensilsAnimation = ({ size }) => {
  return (
    <div className={`utensils-animation utensils-animation--${size}`}>
      <div className="utensil fork">
        <div className="utensil__handle"></div>
        <div className="utensil__head">
          <div className="prong"></div>
          <div className="prong"></div>
          <div className="prong"></div>
        </div>
      </div>
      <div className="utensil knife">
        <div className="utensil__handle"></div>
        <div className="utensil__head"></div>
      </div>
      <div className="utensil spoon">
        <div className="utensil__handle"></div>
        <div className="utensil__head"></div>
      </div>
    </div>
  );
};

const PlatesAnimation = ({ size }) => {
  return (
    <div className={`plates-animation plates-animation--${size}`}>
      <div className="plate plate-1">
        <div className="plate__rim"></div>
        <div className="plate__center"></div>
      </div>
      <div className="plate plate-2">
        <div className="plate__rim"></div>
        <div className="plate__center"></div>
      </div>
      <div className="plate plate-3">
        <div className="plate__rim"></div>
        <div className="plate__center"></div>
      </div>
    </div>
  );
};

const ChefAnimation = ({ size }) => {
  return (
    <div className={`chef-animation chef-animation--${size}`}>
      <div className="chef__hat">
        <div className="hat__base"></div>
        <div className="hat__top"></div>
      </div>
      <div className="chef__body">
        <div className="body__main"></div>
        <div className="body__apron"></div>
      </div>
      <div className="chef__arms">
        <div className="arm arm-left"></div>
        <div className="arm arm-right"></div>
      </div>
    </div>
  );
};

const IngredientsAnimation = ({ size }) => {
  const ingredients = ['🍅', '🧀', '🥬', '🧅', '🍄', '🥕'];
  
  return (
    <div className={`ingredients-animation ingredients-animation--${size}`}>
      {ingredients.map((ingredient, index) => (
        <div 
          key={index} 
          className="ingredient"
          style={{ 
            '--delay': `${index * 0.2}s`,
            '--duration': `${2 + (index % 2)}s`
          }}
        >
          {ingredient}
        </div>
      ))}
    </div>
  );
};

export default FoodLoadingAnimation;
