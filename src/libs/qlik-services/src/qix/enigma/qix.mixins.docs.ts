import mixinList from './qix.mixins.docs.list'
import mixinSelections from './qix.mixins.docs.selection'

export const docMixin = {
    types: ['Doc'],
    // @ts-ignore
    init(args: any) {},
    extend: {
        ...mixinSelections,
        ...mixinList
    }
}
