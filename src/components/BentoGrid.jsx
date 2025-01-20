const BentoGrid = ({ items }) => {
  if (items.length === 1) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
        <div
          className="
            bg-white rounded-lg shadow-md p-6 
            w-full max-w-2xl
            transition duration-300 ease-in-out transform hover:scale-105
          "
        >
          <h2 className="text-xl font-bold mb-2">{items[0].title}</h2>
          <p className="text-gray-600">{items[0].content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`
              bg-white rounded-lg shadow-md p-6 
              ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}
              transition duration-300 ease-in-out transform hover:scale-105
            `}
          >
            <h2 className="text-xl font-bold mb-2">{item.title}</h2>
            <p className="text-gray-600">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BentoGrid;
