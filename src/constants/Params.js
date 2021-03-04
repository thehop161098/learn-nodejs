export const URL_LOGIN_BE = '/dang-nhap-admin.html';
export const URL_ADMIN = '/';
export const URL_LOGIN = '/dang-nhap.html';
export const URL_ACTIVE_ACCOUNT = '/kich-hoat-tai-khoan.html';
export const URL_REGISTER_BE = '/dang-ky-admin.html';
export const URL_REGISTER = '/dang-ky.html';
export const URL_FORGET = '/quen-mat-khau.html';
export const URL_UPDATE_PASS = '/cap-nhat-mat-khau.html';
export const URL_UPDATE_EMAIL = '/cap-nhat-email.html';
export const URL_UPDATE_INFO = '/cap-nhat-thong-tin.html';
export const NAME_ADMIN = 'admin';

export const BE = 1;
export const BE_NAME = "Backend";
export const FE = 2;
export const FE_NAME = "Frontend";

export const YES = 1;
export const NO = 0;

export const NA = 'Lỗi';
export const EMPTY = 'Không có dữ liệu';
export const EMPTY_DEL_ALL = 'Chưa chọn dữ liệu để xóa';

export const PER_PAGE = 20;
export const PER_PAGE_20 = 20;
export const PER_PAGE_30 = 30;
export const PER_PAGE_50 = 50;

export const POSITION_TOAST = 'BOTTOM_RIGHT';

// sort
export const NONE = 0;
export const ASC = 1;
export const DESC = -1;

//Image
export const FILE_IMAGE_LESS_THAN = 2; //MB
export const MESG_FORMAT_IMAGE = "Hình ảnh không đúng định dạng (.png, .jpeg, .jpg, .gif)";
export const TYPE_FORMAT_IMAGE = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

export const MALE = 'male';
export const FEMALE = 'female';

export const TYPE_LINK = 1;
export const TYPE_LINK_NAME = 'Liên kết';
export const TYPE_NEW = 2;
export const TYPE_NEW_NAME = 'Bài viết';
export const TYPE_PAGE = 3;
export const TYPE_PAGE_NAME = 'Trang';
export const TYPE_PAGE_STATIC = 4;

export const ARR_TYPE_ALIAS = [
    { value: TYPE_LINK, name: TYPE_LINK_NAME },
    { value: TYPE_NEW, name: TYPE_NEW_NAME },
    { value: TYPE_PAGE, name: TYPE_PAGE_NAME },
];

export const POSITION_BOTH = 0;
export const POSITION_BOTH_NAME = 'Cả hai';
export const POSITION_TOP = 1;
export const POSITION_TOP_NAME = 'Top';
export const POSITION_BOTTOM = 2;
export const POSITION_BOTTOM_NAME = 'Bottom';

export const ARR_POSITION = [
    { value: POSITION_BOTH, name: POSITION_BOTH_NAME },
    { value: POSITION_TOP, name: POSITION_TOP_NAME },
    { value: POSITION_BOTTOM, name: POSITION_BOTTOM_NAME },
];

export const SLIDER = 1;
export const SLIDER_NAME = 'Slider';
export const ADS = 2;
export const ADS_NAME = 'Quảng cáo';

export const ARR_SLIDER = [
    { value: SLIDER, name: SLIDER_NAME },
    { value: ADS, name: ADS_NAME },
];
