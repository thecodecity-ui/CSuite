const User = require('../models/User.model');
const CourseDetail = require('../models/CourseDetail.model');

const updateVideoProgress = async (userId, courseId, lessonIndex, chapterIndex) => {
  try {
    const user = await User.findById(userId);
    const course = await CourseDetail.findById(courseId);

    let courseProgress = user.courseProgress.find(cp => cp.courseId.equals(courseId));
    if (!courseProgress) {
      courseProgress = { courseId, lessons: [], watchedPercentage: 0 };
      user.courseProgress.push(courseProgress);
    }

    let lessonProgress = courseProgress.lessons.find(lesson => lesson.lessonId === lessonIndex);
    if (!lessonProgress) {
      const lessonData = course.lessons[lessonIndex];
      lessonProgress = { lessonId: lessonIndex, chapters: [] };

      lessonData.chapter.forEach((_, chapterIdx) => {
        lessonProgress.chapters.push({ chapterId: chapterIdx, watched: false });
      });

      courseProgress.lessons.push(lessonProgress);
    }

    const chapterProgress = lessonProgress.chapters[chapterIndex];
    if (chapterProgress) {
      chapterProgress.watched = true;
      chapterProgress.watchedAt = new Date();
    }

    const totalChapters = course.lessons.reduce((acc, lesson) => acc + lesson.chapter.length, 0);
    const watchedChapters = courseProgress.lessons.reduce((acc, lesson) => {
      return acc + lesson.chapters.filter(ch => ch.watched).length;
    }, 0);

    const watchedPercentage = ((watchedChapters / totalChapters) * 100).toFixed(2);
    courseProgress.watchedPercentage = watchedPercentage;

    await user.save();
    return { watchedPercentage, courseProgress };
  } catch (error) {
    console.error('Error updating video progress:', error);
    throw error;
  }
};

const calculateCompletionPercentage = async (userId, courseId) => {
  try {
    const user = await User.findById(userId).populate('courseProgress.courseId');
    const courseProgress = user.courseProgress.find(cp => cp.courseId.equals(courseId));

    if (!courseProgress) {
      return { watchedPercentage: 0, lessons: [] };
    }

    return {
      watchedPercentage: courseProgress.watchedPercentage,
      lessons: courseProgress.lessons.map(lesson => ({
        lessonId: lesson.lessonId,
        chapters: lesson.chapters.map(ch => ({
          chapterId: ch.chapterId,
          watched: ch.watched
        }))
      }))
    };
  } catch (error) {
    console.error('Error calculating completion percentage:', error);
    throw error;
  }
};

module.exports = {
  updateVideoProgress,
  calculateCompletionPercentage
};
