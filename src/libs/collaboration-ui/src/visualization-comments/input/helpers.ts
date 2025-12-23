import emojiPosSuggestions from '@draft-js-plugins/emoji/lib/utils/positionSuggestions'
import mentionPosSuggestions from '@draft-js-plugins/mention/lib/utils/positionSuggestions'

export const mentionPositionSuggestions = ({ decoratorRect, popover, state, props }: any) => {
    const commentWindow = document.getElementById('comment-dialog')
    const cwRect = commentWindow?.getBoundingClientRect()

    const cwXMiddle = Number(cwRect?.left) + Number(cwRect?.width) / 2
    const cwXRight = Number(cwRect?.left) + Number(cwRect?.width)

    const cwYMiddle = Number(cwRect?.top) + Number(cwRect?.height) / 2
    const cwYBottom = Number(cwRect?.top) + Number(cwRect?.height)

    const getXSection = (decoratorLeft: number) => {
        if (decoratorLeft > Number(cwRect?.left) && decoratorLeft < cwXMiddle) return 'left'

        if (decoratorLeft > cwXMiddle && decoratorLeft < cwXRight) return 'right'

        return null
    }

    const getYSection = (decoratorTop: number) => {
        if (decoratorTop > Number(cwRect?.top) && decoratorTop < cwYMiddle) return 'top'

        if (decoratorTop > cwYMiddle && decoratorTop < cwYBottom) return 'bottom'

        return null
    }

    const decoratorXSection = getXSection(decoratorRect.left)
    const decoratorYSection = getYSection(decoratorRect.top)

    const defaults = mentionPosSuggestions({
        decoratorRect,
        popover,
        props
    })

    let transform = 'scale(1) '
    let top = defaults.top

    switch (decoratorXSection) {
        case 'left':
            break
        case 'right':
            transform = `${transform} translateX(-100%)`
            break
    }

    switch (decoratorYSection) {
        case 'top':
            break
        case 'bottom':
            transform = `${transform} translateY(-100%)`
            top = Number(top) - 55
            break
    }

    return {
        ...defaults,
        top,
        transform
    }
}

export const emojiPositionSuggestions = (settings: any) => {
    const commentWindow = document.getElementById('comment-dialog')
    const cwRect = commentWindow?.getBoundingClientRect()

    const cwXMiddle = Number(cwRect?.left) + Number(cwRect?.width) / 2
    const cwXRight = Number(cwRect?.left) + Number(cwRect?.width)

    const cwYMiddle = Number(cwRect?.top) + Number(cwRect?.height) / 2
    const cwYBottom = Number(cwRect?.top) + Number(cwRect?.height)

    const getXSection = (decoratorLeft: number) => {
        if (decoratorLeft > Number(cwRect?.left) && decoratorLeft < cwXMiddle) return 'left'

        if (decoratorLeft > cwXMiddle && decoratorLeft < cwXRight) return 'right'

        return null
    }

    const getYSection = (decoratorTop: number) => {
        if (decoratorTop > Number(cwRect?.top) && decoratorTop < cwYMiddle) return 'top'

        if (decoratorTop > cwYMiddle && decoratorTop < cwYBottom) return 'bottom'

        return null
    }

    const decoratorXSection = getXSection(settings.decoratorRect.left)
    const decoratorYSection = getYSection(settings.decoratorRect.top)

    const defaults = emojiPosSuggestions(settings)

    let transform = 'scale(1) '
    let top = defaults.top

    switch (decoratorXSection) {
        case 'left':
            break
        case 'right':
            transform = `${transform} translateX(-100%)`
            break
    }

    switch (decoratorYSection) {
        case 'top':
            break
        case 'bottom':
            transform = `${transform} translateY(-100%)`
            top = Number(top) - 55
            break
    }

    return {
        ...defaults,
        top,
        transform
    }
}
