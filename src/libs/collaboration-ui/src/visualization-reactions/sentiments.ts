import SvgApplauseIcon from '../res/icons/SvgApplause'
import SvgIdeaIcon from '../res/icons/SvgIdea'
import SvgLikeIcon from '../res/icons/SvgLike'
import SvgThinkingIcon from '../res/icons/SvgSmile4'
import SvgAngryIcon from '../res/icons/SvgSmile6'

export interface Sentiment {
    score: number
    label: string
    icon: any
}

export const sentiments: Array<Sentiment> = [
    { score: 5, label: 'Like', icon: SvgLikeIcon },
    { score: 4, label: 'Idea', icon: SvgIdeaIcon },
    { score: 3, label: 'Applause', icon: SvgApplauseIcon },
    { score: 2, label: 'Thinking', icon: SvgThinkingIcon },
    { score: 1, label: 'Angry', icon: SvgAngryIcon }
]

export { SvgThinkingIcon, SvgAngryIcon, SvgApplauseIcon, SvgIdeaIcon, SvgLikeIcon }
