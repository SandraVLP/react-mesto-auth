function InfoTooltip(props) {


  return (
    <div className={`popup popup_${props.name}` + (props.isOpen && " popup_active")}>
      <div className="popup__container popup__image-container">
        <button
          type="button"
          className="popup__close_element popup__close"
          onClick={props.onClose}
        ></button>
        <img
          className="popup__icon"
          src={props.src}
          alt={props.alt}
        />
        <p className="popup__icon-title">{props.title}</p>
      </div>
    </div>
  );
}

export default InfoTooltip;