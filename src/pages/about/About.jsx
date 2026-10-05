import photo from "../../assets/photo.jpg";

const technologies = [
  "React",
  "Vite",
  "Tailwind CSS",
  "React Router",
  "TanStack React Query",
  "React Hook Form",
  "Axios",
  "json-server",
  "ESLint",
  "GitHub Pages",
];

const About = () => {
  return (
    <div className="flex flex-col gap-10 items-center w-full min-h-screen bg-gray-800 text-white py-10">
      <h1 className="text-xl font-semibold">About ToDoList-SX</h1>
      <p className="text-gray-300">
        ToDoListSX is a simple task manager. You can add, edit, complete and
        delete tasks, search them and filter by status. All data is stored on a
        local fake server, so it stays after you reload the page.
      </p>
      <h2 className="text-lg font-semibold">Technologies</h2>
      <ul className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <li key={tech} className="bg-gray-700 text-sm px-3 py-1 rounded-xl">
            {tech}
          </li>
        ))}
      </ul>
      <h2 className="text-lg font-semibold">About the author</h2>
      <p className="text-gray-300">
        Hi! I am Artem Yatskovskyi, a beginner web developer learning React.
        This project is part of my learning path: I started with localStorage
        and later moved to a REST API, React Query and React Hook Form.
      </p>
      <img
        src={photo}
        alt="Artem"
        className="w-64 h-64 rounded-full object-cover"
      />
    </div>
  );
};

export default About;
