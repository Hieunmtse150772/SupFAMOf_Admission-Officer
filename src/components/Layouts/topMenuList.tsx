import Icons from "icons/sidebar";

const admissionTopMenu = [
  {
    title: "Dashboard",
    Icon: Icons.DashboardIcon,
    path: "/dashboard",
  },
  {
    title: "Collaborator Management",
    Icon: Icons.UserManagementIcon,
    path: "/dashboard/user-list",
  },
  {
    title: "Class Management",
    Icon: Icons.SchoolIcon,
    path: "/dashboard/class-list",
  },
  {
    title: "Post Management",
    Icon: Icons.PostList,
    path: "/dashboard/post-list",
  }
  ,
  {
    title: "Registration Management",
    Icon: Icons.RegistrationList,
    path: "/dashboard/registration-list",
  }
  ,
  {
    title: "Add Post",
    Icon: Icons.AddPostIcon,
    path: "/dashboard/add-post",
  }
  ,
  {
    title: "Contract Management",
    Icon: Icons.DocumentIcon,
    path: "/dashboard/contract-list",
  }
  ,
  {
    title: "Add Contract",
    Icon: Icons.AddToPhotosOutlined,
    path: "/dashboard/add-contract",
  }
];
const administratorMenu = [
  {
    title: "Dashboard",
    Icon: Icons.DashboardIcon,
    path: "/administrator/dashboard",
  },
  {
    title: "Collaborator Management",
    Icon: Icons.UserManagementIcon,
    path: "/administrator/dashboard/user-list",
  },
  {
    title: "Class Management",
    Icon: Icons.SchoolIcon,
    path: "/administrator/dashboard/class-list",
  },
];

export { administratorMenu, admissionTopMenu };

