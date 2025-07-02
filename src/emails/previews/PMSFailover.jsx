import React from 'react'
import { pmsFailOverData as data } from './data/pmsFailover'
import PMSFailover from '../system/PMSFailover'

export default function PMSFailoverPreview() {
    return (
        <PMSFailover {...data} />
    )
}
