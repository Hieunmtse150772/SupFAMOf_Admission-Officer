import {
    ChromeFilled,
    CrownFilled,
    SmileFilled,
    TabletFilled,
} from '@ant-design/icons';
import Icons from "icons/sidebar";

type IconType = typeof ChromeFilled | typeof CrownFilled | typeof SmileFilled | typeof TabletFilled;

const menu = {
    route: {
        path: '/dashboard2',
        routes: [
            {
                path: '/dashboard',
                name: '欢迎',
                //   icon: <SmileFilled rev />,
                component: './Welcome',
            },
            {
                path: '/admin',
                name: '管理页',
                //   icon: <CrownFilled />,
                access: 'canAdmin',
                component: './Admin',
                routes: [
                    {
                        path: '/admin/sub-page1',
                        name: 'Dashboard',
                        icon: Icons.DashboardIcon,
                        component: './Welcome',
                    },
                    {
                        path: '/admin/sub-page2',
                        name: '二级页面',
                        //   icon: <CrownFilled />,
                        component: './Welcome',
                    },
                    {
                        path: '/admin/sub-page3',
                        name: '三级页面',
                        //   icon: <CrownFilled />,
                        component: './Welcome',
                    },
                ],
            },
        ]
    },
    location: {
        pathname: '/',
    },
};
export default menu;