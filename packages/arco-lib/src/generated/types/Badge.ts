
import { Type } from '@sinclair/typebox';
import { Category } from 'src/constants/category';
import { StringUnion } from '../../sunmao-helper';

export const BadgePropsSchema = {
    text:Type.String({
        category:Category.General,
        description:'Set the display text of the status dot'
    }),
    count:Type.Number({
        category:Category.General,
    }),
    dot: Type.Boolean({
        category:Category.Style,
    }),
    maxCount: Type.Number({
        category:Category.General,
    }),
    offset: Type.Tuple([Type.Number(), Type.Number()],{
        category:Category.Layout,
    }),
    color: StringUnion(['red', 'orangered', 'orange', 'gold', 'lime', 'green', 'cyan', 'arcoblue', 'purple', 'pinkpurple', 'magenta', 'gray'],{
        description:'Set the badge color in dot mode',
        category:Category.Style,
    }),
    status: StringUnion(['default', 'processing', 'success', 'warning', 'error'],{
        category:Category.Style,
    }),
}