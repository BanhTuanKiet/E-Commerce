import React, { useState, useEffect } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import Order from './Order'
import Profile from './Profile'
import "../../style/ProfileTabs.css"

export default function ProfileTabs() {
    const [activeTab, setActiveTab] = useState('profile')

    useEffect(() => {
        const hash = window.location.hash.replace('#', '')
        if (['profile', 'order', 'review'].includes(hash)) {
            setActiveTab(hash)
        }
    }, [])

    const handleTabSelect = (k) => {
        setActiveTab(k)
        window.history.pushState(null, '', `#${k}`)
    }

    return (
        <div className="profile-tabs-container">
            <Tabs 
                activeKey={activeTab} 
                onSelect={handleTabSelect} 
                className="custom-tabs"
                variant="pills"
            >
                <Tab eventKey="profile" title={
                    <span className="tab-title">
                        <i className="fas fa-user me-2"></i>
                        Profile
                    </span>
                }>
                    <div className="tab-content-wrapper">
                        <Profile />
                    </div>
                </Tab>
                <Tab eventKey="order" title={
                    <span className="tab-title">
                        <i className="fas fa-shopping-cart me-2"></i>
                        Order
                    </span>
                }>
                    <div className="tab-content-wrapper">
                        <Order />
                    </div>
                </Tab>
                <Tab eventKey="review" title={
                    <span className="tab-title">
                        <i className="fas fa-star me-2"></i>
                        Review
                    </span>
                }>
                    <div className="tab-content-wrapper">
                        <h4>Tab content for Review</h4>
                        <p>Nội dung đánh giá sẽ được hiển thị ở đây.</p>
                    </div>
                </Tab>
            </Tabs>
        </div>
    )
}