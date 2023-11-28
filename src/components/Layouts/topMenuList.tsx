import Icons from "icons/sidebar";

const index = [
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

export default index;
