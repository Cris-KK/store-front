# 商城前端项目（store-front）

本项目是一个基于 **React 18**、**Vite**、**TypeScript** 和 **Tailwind CSS** 的移动端商城前台系统，支持商品浏览、购物车、下单、用户中心、后台管理、智能客服等功能。所有数据均通过浏览器 localStorage 持久化，无需后端服务即可完整体验。

---

## 技术栈

- **React 18**：构建用户界面
- **TypeScript**：类型安全开发
- **Vite**：极速开发与构建工具
- **Tailwind CSS**：原子化 CSS 框架
- **Radix UI（shadcn/ui）**：无样式可定制 UI 组件
- **React Router v6**：路由管理
- **sonner**：优雅的 Toast 通知
- **lucide-react**：现代化图标库

---

## 项目结构

```
store-front/
├── public/                              # 静态资源
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── App.tsx                          # 应用入口，配置主路由
│   ├── main.tsx                         # React 挂载入口
│   ├── index.css                        # Tailwind CSS 全局样式
│   ├── App.css                          # 额外全局样式
│   ├── components/                      # 复用组件
│   │   ├── Header.tsx                   # 顶部栏，含搜索、购物车、用户菜单
│   │   ├── BottomNavigation.tsx         # 移动端底部导航栏
│   │   ├── ProductCard.tsx              # 商品卡片组件
│   │   ├── PromoBanner.tsx              # 首页轮播图
│   │   ├── AddressSelector.tsx          # 地址选择组件
│   │   └── ui/                          # 基础UI组件（按钮、弹窗等）
│   ├── contexts/                        # React Context 全局状态
│   │   └── AuthContext.tsx              # 用户认证上下文
│   ├── hooks/                           # 业务 hooks
│   │   ├── useCart.ts                   # 购物车逻辑与本地存储
│   │   ├── useOrders.ts                 # 订单逻辑与本地存储
│   │   ├── useProducts.ts               # 商品数据与逻辑
│   │   ├── useUsers.ts                  # 用户数据与逻辑
│   │   ├── useAddress.ts                # 地址管理逻辑
│   │   └── use-mobile.tsx               # 移动端适配
│   ├── lib/                             # 工具函数与通用逻辑
│   │   ├── openai.ts                    # 智能客服大模型 API 封装
│   │   └── utils.ts                     # 通用工具函数
│   ├── pages/                           # 路由页面
│   │   ├── Cart.tsx                     # 购物车页
│   │   ├── Category.tsx                 # 分类页
│   │   ├── Checkout.tsx                 # 结算页
│   │   ├── CustomerService.tsx          # 智能客服页面
│   │   ├── Index.tsx                    # 首页
│   │   ├── Login.tsx                    # 登录页
│   │   ├── NotFound.tsx                 # 404未找到页面
│   │   ├── Order.tsx                    # 订单详情页
│   │   ├── Product.tsx                  # 商品详情页
│   │   ├── Profile.tsx                  # 用户中心
│   │   ├── Register.tsx                 # 注册页
│   │   ├── Vendor.tsx                   # 商户管理界面  
│   │   ├── ManageLogin.tsx              # 管理端网页登录 
│   │   └── admin/                       # 后台管理页面
│   │       ├── AdminDashboard.tsx       # 管理员后台首页
│   │       ├── AdminProducts.tsx        # 商品管理
│   │       ├── AdminOrders.tsx          # 订单管理
│   │       └── AdminUsers.tsx           # 用户管理
│   └── vite-env.d.ts                    # Vite 环境类型声明
├── .env   
├── .gitignore
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
├── tsconfig.app.json 
├── tsconfig.json                 
├── tsconfig.node.json
└── vite.config.ts
```

---

## 主要功能模块

### 1. 首页与商品浏览

- 首页轮播图、商品分类、热门商品展示
- 分类页支持商品搜索与分类筛选
- 商品详情页支持商品信息、评价、加入购物车、立即购买

### 2. 购物车

- 支持商品数量调整、选择、删除、全选、结算
- 购物车数据存储于 localStorage，支持游客与登录用户分离

### 3. 订单与结算

- 结算页支持地址选择、支付方式选择、订单确认
- 订单详情页展示订单状态、商品、收货信息、费用明细
- 支持订单状态流转（待支付、待发货、已发货、已完成）

### 4. 用户中心

- 展示用户信息、积分、订单统计、地址管理
- 支持地址的增删改查、设为默认

### 5. 后台管理

- 管理员可登录后台，管理商品、订单、用户
- 商品管理支持增删改查、图片上传、分类筛选
- 订单管理支持发货、状态修改
- 用户管理支持角色切换、禁用启用

### 6. 智能客服

- 智能客服页面支持自然语言对话，自动结合商品和订单数据为用户答疑
- 基于大模型 API（如通义千问/Qwen），需配置 API KEY
- 支持上下文多轮对话，自动滚动，体验接近真实客服

---

## 数据存储说明

- **商品、用户、订单、购物车、地址等数据均存储在 localStorage**
  - 购物车：`cart_用户id` 或 `cart_guest`
  - 订单：`orders_用户id` 或 `orders_guest`
  - 用户：`registered_users`
  - 地址：`address_用户id`
- 数据结构详见 [`src/hooks/`](src/hooks/) 目录下各 hooks 文件

---

## 启动与开发

1. 安装依赖

   ```sh
   npm install
   ```

2. 配置环境变量

   - 在项目根目录下新建 `.env` 文件，添加如下内容（需自行申请 API KEY）：

     ```
     VITE_OPENAI_API_KEY=你的API密钥
     ```

   - 智能客服功能依赖此 KEY，否则无法正常使用。

3. 启动开发服务器

   ```sh
   npm run dev
   ```

4. 访问 [http://localhost:8080](http://localhost:8080)

---

## 账号说明

- 默认管理员账号：  
  - 邮箱：admin@mall.com  
  - 密码：admin123
- 默认商家账号：  
  - 邮箱：vendor@mall.com  
  - 密码：vendor123

---

## 其它说明

- UI 基于 shadcn/ui + Tailwind，风格简洁，移动端适配良好
- 所有数据仅存于浏览器本地，刷新不会丢失，清除 localStorage 后数据重置
- 智能客服功能调用大模型 API，请自行申请

---

## 目录与功能对应表

| 目录/文件                                               | 主要功能/说明                       |
|--------------------------------------------------------|------------------------------------|
| [`src/components/Header.tsx`](src/components/Header.tsx)              | 顶部栏，含搜索、购物车、用户菜单      |
| [`src/components/BottomNavigation.tsx`](src/components/BottomNavigation.tsx) | 底部导航栏                          |
| [`src/components/ProductCard.tsx`](src/components/ProductCard.tsx)    | 商品卡片组件                        |
| [`src/components/PromoBanner.tsx`](src/components/PromoBanner.tsx)    | 首页轮播图                          |
| [`src/components/AddressSelector.tsx`](src/components/AddressSelector.tsx) | 地址选择组件                        |
| [`src/components/ui/`](src/components/ui/)                            | 基础UI组件（按钮、输入框等）         |
| [`src/contexts/AuthContext.tsx`](src/contexts/AuthContext.tsx)        | 用户认证全局状态                    |
| [`src/hooks/useCart.ts`](src/hooks/useCart.ts)                        | 购物车逻辑与本地存储                 |
| [`src/hooks/useOrders.ts`](src/hooks/useOrders.ts)                    | 订单逻辑与本地存储                   |
| [`src/hooks/useProducts.ts`](src/hooks/useProducts.ts)                | 商品数据与逻辑                       |
| [`src/hooks/useUsers.ts`](src/hooks/useUsers.ts)                      | 用户数据与逻辑                       |
| [`src/hooks/useAddress.ts`](src/hooks/useAddress.ts)                  | 地址管理逻辑                         |
| [`src/hooks/use-mobile.tsx`](src/hooks/use-mobile.tsx)                | 移动端适配                           |
| [`src/lib/openai.ts`](src/lib/openai.ts)                              | 智能客服大模型 API 封装              |
| [`src/pages/Index.tsx`](src/pages/Index.tsx)                          | 首页                                 |
| [`src/pages/Category.tsx`](src/pages/Category.tsx)                    | 分类页                               |
| [`src/pages/Product.tsx`](src/pages/Product.tsx)                      | 商品详情页                           |
| [`src/pages/Cart.tsx`](src/pages/Cart.tsx)                            | 购物车页                             |
| [`src/pages/Checkout.tsx`](src/pages/Checkout.tsx)                    | 结算页                               |
| [`src/pages/Profile.tsx`](src/pages/Profile.tsx)                      | 用户中心                             |
| [`src/pages/Order.tsx`](src/pages/Order.tsx)                          | 订单详情页                           |
| [`src/pages/CustomerService.tsx`](src/pages/CustomerService.tsx)      | 智能客服页面                         |
| [`src/pages/admin/AdminDashboard.tsx`](src/pages/admin/AdminDashboard.tsx) | 管理后台首页                    |
| [`src/pages/admin/AdminProducts.tsx`](src/pages/admin/AdminProducts.tsx)   | 商品管理                        |
| [`src/pages/admin/AdminOrders.tsx`](src/pages/admin/AdminOrders.tsx)       | 订单管理                        |
| [`src/pages/admin/AdminUsers.tsx`](src/pages/admin/AdminUsers.tsx)         | 用户管理                        |