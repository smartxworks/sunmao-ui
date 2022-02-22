
import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category'


export const ProgressPropsSchema = {
    percent: Type.Number({
        title:'Percent',
        category:Category.Basic
    }),
    type: StringUnion(['line', 'circle'],{
        title:'Type',
        category:Category.Style
    }),
    status: StringUnion(['success', 'error', 'normal', 'warning'],{
        title:'Status',
        category:Category.Style
    }),
    color: Type.String({
        title:'Color',
        category:Category.Style,
        description:"Please input a color name such as 'red' or a color code such as '#c10'"
    }),
    trailColor:Type.String({
        title:'Trail Color',
        category:Category.Style
    }),
    showText:Type.Boolean({
        title:'Show Text',
        category:Category.Basic
    }),
    width:Type.Number({
        title:'Width',
        category:Category.Style
    }),
    size:StringUnion(['small' , 'default' , 'mini' , 'large'],{
        title:'Size',
        category:Category.Style
    }),
}