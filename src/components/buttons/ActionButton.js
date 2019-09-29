import Button from '@vkontakte/vkui/dist/components/Button/Button';
const ActionButton = (props) => {
    const { icon } = props
    return (
        <div>
            <Button before={icon}/>
        </div>
    )
}