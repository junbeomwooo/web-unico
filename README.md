# Online Eyewear Store 'UNICO'

![UNICO](./unico/src/assets/mainpage/unico.jpg)

• [Visit the website here](http://ec2-3-73-1-218.eu-central-1.compute.amazonaws.com:3001/)

•	Admin Account : admin123    
•	Admin Password : admin123123!  
<br /> <br />
## Introduction
I have created a virtual brand named 'UNICO' specializing in selling sunglasses and eyeglasses.

I created a responsive website with a backend server for smooth communication between clients and data.

Additionally, I implemented efficient data processing and retrieval in dynamic web applications using MySQL.

<br /> <br />
## Development Environment
•	Client : HTML, React, Styled-components, Redux

•	Server : Node.js, Express

•	Database : MySQL

•	Version and issue management : Github

•	Deployment environment : Amazon web services(AWS)

•	Design : Adobe Illustrator, Adobe Photoshop

<br /> <br />
## Project structure  

```
├── README.md
└── unico
    ├── README.md
    ├── favicon.png
    ├── files
    │   ├── _logs
    │   ├── thumbnail
    │   └── upload
    ├── package.json
    ├── public
    │   ├── asset-manifest.json
    │   ├── assets
    │   │   └── img
    │   │       ├── ryan.gif
    │   │       └── upload.jpg
    │   ├── favicon.ico
    │   ├── index.html
    │   ├── logo192.png
    │   ├── logo512.png
    │   ├── manifest.json
    │   ├── ms-icon-310x310.png
    │   ├── robots.txt
    │   ├── static
    │   │   ├── css
    │   │   │   ├── main.7a20afcd.css
    │   │   │   └── main.7a20afcd.css.map
    │   │   ├── js
    │   │   │   ├── main.7e5ffcc1.js
    │   │   │   ├── main.7e5ffcc1.js.LICENSE.txt
    │   │   │   ├── main.7e5ffcc1.js.map
    │   │   │   ├── main.8bcfa3fd.js
    │   │   │   ├── main.8bcfa3fd.js.LICENSE.txt
    │   │   │   ├── main.8bcfa3fd.js.map
    │   │   │   ├── reactPlayerDailyMotion.9239bc39.chunk.js
    │   │   │   ├── reactPlayerDailyMotion.9239bc39.chunk.js.map
    │   │   │   ├── reactPlayerFacebook.2ae515ca.chunk.js
    │   │   │   ├── reactPlayerFacebook.2ae515ca.chunk.js.map
    │   │   │   ├── reactPlayerFilePlayer.f1ab127e.chunk.js
    │   │   │   ├── reactPlayerFilePlayer.f1ab127e.chunk.js.map
    │   │   │   ├── reactPlayerKaltura.c31933c7.chunk.js
    │   │   │   ├── reactPlayerKaltura.c31933c7.chunk.js.map
    │   │   │   ├── reactPlayerMixcloud.982d3fb0.chunk.js
    │   │   │   ├── reactPlayerMixcloud.982d3fb0.chunk.js.map
    │   │   │   ├── reactPlayerMux.7d981519.chunk.js
    │   │   │   ├── reactPlayerMux.7d981519.chunk.js.map
    │   │   │   ├── reactPlayerPreview.ef014284.chunk.js
    │   │   │   ├── reactPlayerPreview.ef014284.chunk.js.map
    │   │   │   ├── reactPlayerSoundCloud.2f0268d8.chunk.js
    │   │   │   ├── reactPlayerSoundCloud.2f0268d8.chunk.js.map
    │   │   │   ├── reactPlayerStreamable.11a0a851.chunk.js
    │   │   │   ├── reactPlayerStreamable.11a0a851.chunk.js.map
    │   │   │   ├── reactPlayerTwitch.15af10f2.chunk.js
    │   │   │   ├── reactPlayerTwitch.15af10f2.chunk.js.map
    │   │   │   ├── reactPlayerVidyard.7dbaf84e.chunk.js
    │   │   │   ├── reactPlayerVidyard.7dbaf84e.chunk.js.map
    │   │   │   ├── reactPlayerVimeo.dfe56b06.chunk.js
    │   │   │   ├── reactPlayerVimeo.dfe56b06.chunk.js.map
    │   │   │   ├── reactPlayerWistia.54ce6c90.chunk.js
    │   │   │   ├── reactPlayerWistia.54ce6c90.chunk.js.map
    │   │   │   ├── reactPlayerYouTube.8fc35c15.chunk.js
    │   │   │   └── reactPlayerYouTube.8fc35c15.chunk.js.map
    │   │   └── media
    │   │       ├── 3.183638646fe62a914062.avif
    │   │       ├── 4.beaf33576a5c08c509d3.avif
    │   │       ├── glasses.8b66887df38f3a976e53.png
    │   │       ├── logo.75f46a9affbcd24b8b2e.png
    │   │       ├── maison.a654da831e0146d4feb5.png
    │   │       ├── mobile1.b8ec4569ce327cb178ca.jpg
    │   │       ├── mobile2.0bc61f19ebb92513a6ae.jpg
    │   │       ├── mobile3.a8e3c21ae57499a965d4.jpg
    │   │       ├── mobile4.d320486794475d847265.jpg
    │   │       ├── noimage.e10494364b4ed590210f.png
    │   │       ├── search.f2d70afd1ebdca42594e.png
    │   │       └── sunglasses.0e5e0ffdbde4526593d4.png
    │   ├── video.mp4
    │   └── video2.mp4
    ├── server
    │   ├── app.js
    │   ├── controllers
    │   │   ├── CartController.js
    │   │   ├── CategoryController.js
    │   │   ├── GuestCartController.js
    │   │   ├── GuestOrderDetailController.js
    │   │   ├── MemberController.js
    │   │   ├── OrderDatailController.js
    │   │   ├── SubCategoryController.js
    │   │   └── UploadMulti.js
    │   ├── favicon.png
    │   ├── helper
    │   │   ├── DBPool.js
    │   │   ├── ExceptionHelper.js
    │   │   ├── FileHelper.js
    │   │   ├── LogHelper.js
    │   │   ├── RegexHelper.js
    │   │   ├── UtilHelper.js
    │   │   └── WebHelper.js
    │   ├── mappers
    │   │   ├── CartMapper.xml
    │   │   ├── CategoryMapper.xml
    │   │   ├── GuestOrderDetailMapper.xml
    │   │   ├── MemberMapper.xml
    │   │   ├── OrderDetailMapper.xml
    │   │   ├── ProductMapper.xml
    │   │   └── SubCategoryMapper.xml
    │   ├── services
    │   │   ├── CartService.js
    │   │   ├── CategoryService.js
    │   │   ├── GuestOrderDetailService.js
    │   │   ├── MemberService.js
    │   │   ├── OrderDetailService.js
    │   │   ├── ProductService.js
    │   │   └── SubCategoryService.js
    │   └── test
    │       ├── DepartmentAddItemTest.js
    │       ├── DepartmentDeleteItemTest.js
    │       ├── DepartmentEditItemTest.js
    │       ├── DepartmentGetCountTest.js
    │       ├── DepartmentGetItemTest.js
    │       └── DepartmentGetListTest.js
    ├── src
    │   ├── App.js
    │   ├── MediaQuery
    │   │   └── MediaQuery.js
    │   ├── Meta.js
    │   ├── Pages
    │   │   ├── AccountSetting.js
    │   │   ├── AddressEdit.js
    │   │   ├── AddressSetting.js
    │   │   ├── Cart.js
    │   │   ├── CheckPassword.js
    │   │   ├── ConfirmPayment.js
    │   │   ├── Contact.js
    │   │   ├── CreateAcc.js
    │   │   ├── FAQ.js
    │   │   ├── FaqOrder.js
    │   │   ├── FindMyPassword.js
    │   │   ├── Glasses.js
    │   │   ├── InfoEdit.js
    │   │   ├── Login.js
    │   │   ├── MainPage.js
    │   │   ├── NonTrackOrder.js
    │   │   ├── PasswordSetting.js
    │   │   ├── Payment.js
    │   │   ├── ProductView.js
    │   │   ├── Shipping.js
    │   │   ├── Sunglasses.js
    │   │   ├── TrackOrder.js
    │   │   ├── TrackOrderDetail.js
    │   │   ├── ViewAll.js
    │   │   ├── ViewOrder.js
    │   │   └── admin
    │   │       ├── AddProduct.js
    │   │       ├── Admin.js
    │   │       ├── AdminMember.js
    │   │       ├── EditProduct.js
    │   │       ├── MemberStatistics.js
    │   │       ├── MemberView.js
    │   │       ├── OrderManagemet.js
    │   │       ├── OrderView.js
    │   │       └── ProductManagement.js
    │   ├── Test.js
    │   ├── assets
    │   │   ├── buttons
    │   │   │   ├── menu.png
    │   │   │   ├── noimage.png
    │   │   │   └── search.png
    │   │   ├── logo.png
    │   │   ├── mainpage
    │   │   │   ├── 3.avif
    │   │   │   ├── 4.avif
    │   │   │   ├── mobile1.jpg
    │   │   │   ├── mobile2.jpg
    │   │   │   ├── mobile3.jpg
    │   │   │   ├── mobile4.jpg
    │   │   │   └── unico.jpg
    │   │   ├── maison.png
    │   │   └── productpage
    │   │       ├── glasses.png
    │   │       ├── hello.jpeg
    │   │       └── sunglasses.png
    │   ├── components
    │   │   ├── ErrorView.js
    │   │   ├── Footer.js
    │   │   ├── Header.js
    │   │   ├── Spinner.js
    │   │   ├── Table.js
    │   │   ├── TableEx.js
    │   │   └── admin
    │   │       └── adminNavigation.js
    │   ├── helper
    │   │   ├── ExceptionHelper.js
    │   │   ├── Pagenation.js
    │   │   ├── ReduxHelper.js
    │   │   ├── RegexHelper.js
    │   │   └── UtilHelper.js
    │   ├── hooks
    │   │   ├── colorReducer.js
    │   │   └── useQueryString.js
    │   ├── index.js
    │   ├── slices
    │   │   ├── CartSlice.js
    │   │   ├── CategorySlice.js
    │   │   ├── DepartmentSlice.js
    │   │   ├── GuestCartSlice.js
    │   │   ├── GuestOrderDetailSlice.js
    │   │   ├── MemberSlice.js
    │   │   ├── OrderDetailSlice.js
    │   │   ├── ProductSlice.js
    │   │   ├── SubCategorySlice.js
    │   │   └── fontColorReducer.js
    │   └── store.js
    └── yarn.lock


```

 
