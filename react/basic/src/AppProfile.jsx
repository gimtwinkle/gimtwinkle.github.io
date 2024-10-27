import "./App.css";
import Profile from "./Profile";

function App() {
  const profileData = [
    {
      img: "https://randomuser.me/api/portraits/men/75.jpg",
      name: "bob",
      position: "프론트엔드",
      isNew: true,
    },
    {
      img: "https://randomuser.me/api/portraits/men/76.jpg",
      name: "james",
      position: "백엔드",
      isNew: false,
    },
    {
      img: "https://randomuser.me/api/portraits/men/77.jpg",
      name: "jassy",
      position: "디자이너",
      isNew: true,
    },
  ];

  return (
    <div className="App">
      {profileData.map((item) => (
        <Profile
          img={item.img}
          name={item.name}
          position={item.position}
          isNew={item.isNew}
        />
      ))}
    </div>
  );
}

export default App;
