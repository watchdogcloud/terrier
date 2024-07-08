enum RolesEnum {
    USER = 1,
    ORGANIZATION_ADMIN = 256,
    ADMIN = 512,
    SUPER_ADMIN = 32768,
 }
 
export const RolesEnumList = [
  RolesEnum.USER,
  RolesEnum.ORGANIZATION_ADMIN,
  RolesEnum.ADMIN,
  RolesEnum.SUPER_ADMIN,
];
 
export default RolesEnum;