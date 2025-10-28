import { useTranslation } from 'react-i18next';
import { Card } from 'flowbite-react';
import { KuInput, KuButton } from '@/components/ku-components';
import { Course } from '../models/course';

interface CoursesFormProps {
  courses: Course[];
  onAddCourse: () => void;
  onRemoveCourse: (index: number) => void;
  onCourseChange: (index: number, field: string, value: string) => void;
}

export const CoursesForm = ({
  courses,
  onAddCourse,
  onRemoveCourse,
  onCourseChange
}: CoursesFormProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("profile.person.courses")}
        </h3>
        <KuButton
          id="add-course"
          type="button"
          actionType="button"
          variant="secondary"
          size="sm"
          label={t("profile.person.add_course")}
          onClick={onAddCourse}
        />
      </div>

      {courses?.map((course, index) => (
        <div key={index} className="border rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
              {t("profile.person.course")} {index + 1}
            </h4>
            <KuButton
              id={`remove-course-${index}`}
              type="button"
              actionType="button"
              variant="danger"
              size="sm"
              label={t("profile.person.remove_course")}
              onClick={() => onRemoveCourse(index)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <KuInput
              name={`personCourseName-${index}`}
              dataType="text"
              label={t("profile.person.course_name")}
              value={course.name || ''}
              onChange={(e) => onCourseChange(index, 'name', e.target.value)}
            />
            <KuInput
              name={`personCourseInstitution-${index}`}
              dataType="text"
              label={t("profile.person.course_institution")}
              value={course.institution || ''}
              onChange={(e) => onCourseChange(index, 'institution', e.target.value)}
            />
            <KuInput
              name={`personCourseStartDate-${index}`}
              dataType="date"
              label={t("profile.person.course_start_date")}
              value={course.startDate || ''}
              onChange={(e) => onCourseChange(index, 'startDate', e.target.value)}
            />
            <KuInput
              name={`personCourseFinishDate-${index}`}
              dataType="date"
              label={t("profile.person.course_finish_date")}
              value={course.finishDate || ''}
              onChange={(e) => onCourseChange(index, 'finishDate', e.target.value)}
            />
            <KuInput
              name={`personCourseCertificateFile-${index}`}
              dataType="text"
              label={t("profile.person.course_certificate")}
              value={course.certificateFile || ''}
              onChange={(e) => onCourseChange(index, 'certificateFile', e.target.value)}
            />
          </div>
        </div>
      ))}
    </Card>
  );
}
