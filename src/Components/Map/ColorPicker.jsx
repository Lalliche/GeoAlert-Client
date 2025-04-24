const ColorPicker = ({ selectedColor, setSelectedColor }) => {
  const colors = [
    "#FF5F5F",
    "#FFD05F",
    "#5FFF8D",
    "#5FD8FF",
    "#9B5FFF",
    "#FF5FB2",
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-700">Color:</span>
      <div className="flex gap-1">
        {colors.map((color) => (
          <div
            key={color}
            className={`w-5 h-5 rounded-full cursor-pointer border-2 ${
              selectedColor === color ? "border-black" : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
