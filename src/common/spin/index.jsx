import React from 'react';
import loading from '@/assets/img/loading.gif';
import Portal from './portal';
import './index.scss';

const Spin = (props) => {
	const {
		children, modal, visible, text, id, simple,
	} = props;
	const content = text || '加载中，请稍后...';
	if (modal) {
		return (
			<Portal visible={visible}>
				<div className={`yc-spin-wrapper yc-spin-modal ${simple ? 'yc-spin-wrapper-simple' : ''}`} id={id}>
					<div className={`yc-spin-mask ${visible ? '' : 'displayNone'}`}>
						<div className="yc-mask-wrapper-modal">
							<div className="yc-mask-content">
								<img src={loading} alt="" />
								<div>{content}</div>
							</div>
						</div>
					</div>
					<div className="yc-spin-blur yc-spin-content-modal" />
				</div>
			</Portal>
		);
	}
	return (
		<div className={`yc-spin-wrapper ${simple ? 'yc-spin-wrapper-simple' : ''}`} id={id}>
			<div className={`yc-spin-mask ${visible ? '' : 'displayNone'}`}>
				<div className="yc-mask-wrapper">
					<div className="yc-mask-content">
						<img src={loading} alt="" />
						<div>{content}</div>
					</div>
				</div>
			</div>
			<div className={`yc-spin-content ${visible ? 'yc-spin-blur' : ''}`} id="yc-spin-content">
				{children}
			</div>
		</div>
	);
};

export default Spin;