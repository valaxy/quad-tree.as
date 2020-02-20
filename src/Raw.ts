// 通过修改这个地方的类型配置文件，对本模块进行ts编译和as编译的无缝转换

//==================================================
// For TypeScript
//==================================================
export type mFloat32 = number
export type mUint32 = number
export type mUnit16 = number
export type mUint8 = number
export const mMaxUint32 = 4294967295
export const mMinUint32 = 0



//==================================================
// For AssemblyScript
//==================================================
// export type mFloat32 = f32
// export type mUint32 = u32
// export const mMaxUint32 = u32.MAX_VALUE
// export const mMinUint32 = u32.MIN_VALUE


