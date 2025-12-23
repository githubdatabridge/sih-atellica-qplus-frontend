import { useEffect, useState } from 'react'

import { useQlikReportingContext } from '../contexts/QlikReportingContext'

const useReportAccessRights = () => {
    const [isReportReadOnly, setIsReportReadOnly] = useState<boolean>()
    const { isReportPersonal, isReportSystem, isReportAdmin } = useQlikReportingContext()

    useEffect(() => {
        const readOnly = !(
            (isReportPersonal && !isReportSystem && !isReportAdmin) ||
            (isReportPersonal && isReportSystem && isReportAdmin)
        )

        setIsReportReadOnly(readOnly)
    }, [isReportPersonal, isReportSystem, isReportAdmin])

    return { isReportReadOnly }
}

export default useReportAccessRights
