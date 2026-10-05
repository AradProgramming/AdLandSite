
import 'dart:async';
import 'dart:convert';
import 'dart:math';
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:audioplayers/audioplayers.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:shamsi_date/shamsi_date.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Notify.init();
  final store = RoshdStore();
  await store.load();
  runApp(RoshdApp(store: store));
}

String tr(String lang, String fa, String en) => lang == 'fa' ? fa : en;
String makeId() => DateTime.now().microsecondsSinceEpoch.toString() + '_' + Random().nextInt(999999).toString();

bool sameDay(DateTime a, DateTime b) {
  return a.year == b.year && a.month == b.month && a.day == b.day;
}

String dateLabel(DateTime d, String lang) {
  if (lang == 'en') {
    return DateFormat('EEE, MMM d').format(d);
  }
  final j = Jalali.fromDateTime(d);
  return j.year.toString() + '/' +
      j.month.toString().padLeft(2, '0') + '/' +
      j.day.toString().padLeft(2, '0');
}

String timeLabel(DateTime d) => DateFormat('HH:mm').format(d);

T? firstOrNull<T>(Iterable<T> items) {
  for (final item in items) {
    return item;
  }
  return null;
}

class StudyTask {
  String id;
  String title;
  String subject;
  DateTime at;
  int minutes;
  int priority;
  bool done;

  StudyTask({
    required this.id,
    required this.title,
    required this.subject,
    required this.at,
    required this.minutes,
    this.priority = 2,
    this.done = false,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'subject': subject,
    'at': at.toIso8601String(),
    'minutes': minutes,
    'priority': priority,
    'done': done,
  };

  factory StudyTask.fromJson(Map<String, dynamic> j) => StudyTask(
    id: (j['id'] ?? makeId()).toString(),
    title: (j['title'] ?? '').toString(),
    subject: (j['subject'] ?? 'عمومی').toString(),
    at: DateTime.tryParse((j['at'] ?? '').toString()) ?? DateTime.now(),
    minutes: (j['minutes'] as num?)?.toInt() ?? 30,
    priority: (j['priority'] as num?)?.toInt() ?? 2,
    done: j['done'] == true,
  );
}

class StudySession {
  DateTime at;
  int minutes;
  String subject;

  StudySession({
    required this.at,
    required this.minutes,
    required this.subject,
  });

  Map<String, dynamic> toJson() => {
    'at': at.toIso8601String(),
    'minutes': minutes,
    'subject': subject,
  };

  factory StudySession.fromJson(Map<String, dynamic> j) => StudySession(
    at: DateTime.tryParse((j['at'] ?? '').toString()) ?? DateTime.now(),
    minutes: (j['minutes'] as num?)?.toInt() ?? 0,
    subject: (j['subject'] ?? 'عمومی').toString(),
  );
}

class SubjectItem {
  String name;
  int goal;
  int color;

  SubjectItem({
    required this.name,
    this.goal = 180,
    this.color = 0xff7bf6df,
  });

  Map<String, dynamic> toJson() => {
    'name': name,
    'goal': goal,
    'color': color,
  };

  factory SubjectItem.fromJson(Map<String, dynamic> j) => SubjectItem(
    name: (j['name'] ?? 'عمومی').toString(),
    goal: (j['goal'] as num?)?.toInt() ?? 180,
    color: (j['color'] as num?)?.toInt() ?? 0xff7bf6df,
  );
}

class Flashcard {
  String id;
  String deck;
  String front;
  String back;
  int mastery;

  Flashcard({
    required this.id,
    required this.deck,
    required this.front,
    required this.back,
    this.mastery = 0,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'deck': deck,
    'front': front,
    'back': back,
    'mastery': mastery,
  };

  factory Flashcard.fromJson(Map<String, dynamic> j) => Flashcard(
    id: (j['id'] ?? makeId()).toString(),
    deck: (j['deck'] ?? 'عمومی').toString(),
    front: (j['front'] ?? '').toString(),
    back: (j['back'] ?? '').toString(),
    mastery: (j['mastery'] as num?)?.toInt() ?? 0,
  );
}

class ExamItem {
  String id;
  String title;
  String subject;
  DateTime at;

  ExamItem({
    required this.id,
    required this.title,
    required this.subject,
    required this.at,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'subject': subject,
    'at': at.toIso8601String(),
  };

  factory ExamItem.fromJson(Map<String, dynamic> j) => ExamItem(
    id: (j['id'] ?? makeId()).toString(),
    title: (j['title'] ?? '').toString(),
    subject: (j['subject'] ?? 'عمومی').toString(),
    at: DateTime.tryParse((j['at'] ?? '').toString()) ?? DateTime.now(),
  );
}

class NoteItem {
  String id;
  String title;
  String body;
  String subject;
  DateTime at;

  NoteItem({
    required this.id,
    required this.title,
    required this.body,
    required this.subject,
    required this.at,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'body': body,
    'subject': subject,
    'at': at.toIso8601String(),
  };

  factory NoteItem.fromJson(Map<String, dynamic> j) => NoteItem(
    id: (j['id'] ?? makeId()).toString(),
    title: (j['title'] ?? '').toString(),
    body: (j['body'] ?? '').toString(),
    subject: (j['subject'] ?? 'عمومی').toString(),
    at: DateTime.tryParse((j['at'] ?? '').toString()) ?? DateTime.now(),
  );
}

class RoshdStore extends ChangeNotifier {
  final List<StudyTask> tasks = [];
  final List<StudySession> sessions = [];
  final List<SubjectItem> subjects = [];
  final List<Flashcard> cards = [];
  final List<ExamItem> exams = [];
  final List<NoteItem> notes = [];

  String lang = 'fa';
  String accent = 'aurora';
  String alarm = 'soft';
  ThemeMode mode = ThemeMode.dark;
  int dailyGoal = 180;
  int tab = 0;
  bool notifications = true;
  bool sounds = true;
  double volume = .55;

  late SharedPreferences _prefs;

  Future<void> load() async {
    _prefs = await SharedPreferences.getInstance();
    lang = _prefs.getString('lang') ?? 'fa';
    accent = _prefs.getString('accent') ?? 'aurora';
    alarm = _prefs.getString('alarm') ?? 'soft';
    mode = _prefs.getBool('light') == true ? ThemeMode.light : ThemeMode.dark;
    dailyGoal = _prefs.getInt('goal') ?? 180;
    notifications = _prefs.getBool('notifications') ?? true;
    sounds = _prefs.getBool('sounds') ?? true;
    volume = _prefs.getDouble('volume') ?? .55;

    tasks
      ..clear()
      ..addAll(_readList('tasks', StudyTask.fromJson));
    sessions
      ..clear()
      ..addAll(_readList('sessions', StudySession.fromJson));
    subjects
      ..clear()
      ..addAll(_readList('subjects', SubjectItem.fromJson));
    cards
      ..clear()
      ..addAll(_readList('cards', Flashcard.fromJson));
    exams
      ..clear()
      ..addAll(_readList('exams', ExamItem.fromJson));
    notes
      ..clear()
      ..addAll(_readList('notes', NoteItem.fromJson));

    if (subjects.isEmpty) {
      subjects.addAll([
        SubjectItem(name: 'ریاضی', goal: 240, color: 0xff7bf6df),
        SubjectItem(name: 'علوم', goal: 180, color: 0xff8a7cff),
        SubjectItem(name: 'فارسی', goal: 150, color: 0xfff4d47c),
        SubjectItem(name: 'انگلیسی', goal: 120, color: 0xffff8fb1),
      ]);
      await save();
    }
    notifyListeners();
  }

  List<T> _readList<T>(String key, T Function(Map<String, dynamic>) parse) {
    final raw = _prefs.getString(key);
    if (raw == null) return [];
    try {
      final value = jsonDecode(raw);
      if (value is! List) return [];
      return value
          .whereType<Map>()
          .map((e) => parse(Map<String, dynamic>.from(e)))
          .toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> save() async {
    await Future.wait([
      _prefs.setString('tasks', jsonEncode(tasks.map((e) => e.toJson()).toList())),
      _prefs.setString('sessions', jsonEncode(sessions.map((e) => e.toJson()).toList())),
      _prefs.setString('subjects', jsonEncode(subjects.map((e) => e.toJson()).toList())),
      _prefs.setString('cards', jsonEncode(cards.map((e) => e.toJson()).toList())),
      _prefs.setString('exams', jsonEncode(exams.map((e) => e.toJson()).toList())),
      _prefs.setString('notes', jsonEncode(notes.map((e) => e.toJson()).toList())),
      _prefs.setString('lang', lang),
      _prefs.setString('accent', accent),
      _prefs.setString('alarm', alarm),
      _prefs.setBool('light', mode == ThemeMode.light),
      _prefs.setInt('goal', dailyGoal),
      _prefs.setBool('notifications', notifications),
      _prefs.setBool('sounds', sounds),
      _prefs.setDouble('volume', volume),
    ]);
    notifyListeners();
  }

  void setTab(int value) {
    tab = value;
    notifyListeners();
  }

  Future<void> setLang(String value) async {
    lang = value == 'en' ? 'en' : 'fa';
    await save();
  }

  List<StudyTask> todayTasks() {
    final list = tasks.where((x) => sameDay(x.at, DateTime.now())).toList();
    list.sort((a, b) => a.at.compareTo(b.at));
    return list;
  }

  int todayMinutes() {
    return sessions.where((x) => sameDay(x.at, DateTime.now())).fold(0, (a, x) => a + x.minutes);
  }

  int totalMinutes() => sessions.fold(0, (a, x) => a + x.minutes);

  double progressToday() {
    if (dailyGoal <= 0) return 0;
    return min(1.0, todayMinutes() / dailyGoal);
  }

  int subjectMinutes(String subject) {
    return sessions.where((x) => x.subject == subject).fold(0, (a, x) => a + x.minutes);
  }

  int streak() {
    final dates = sessions
        .map((x) => DateTime(x.at.year, x.at.month, x.at.day))
        .toSet();
    var d = DateTime.now();
    var result = 0;
    while (dates.contains(DateTime(d.year, d.month, d.day))) {
      result++;
      d = d.subtract(const Duration(days: 1));
    }
    return result;
  }

  Future<void> addTask(StudyTask value) async {
    tasks.add(value);
    await save();
  }

  Future<void> toggleTask(StudyTask value) async {
    value.done = !value.done;
    await save();
  }

  Future<void> deleteTask(StudyTask value) async {
    tasks.remove(value);
    await save();
  }

  Future<void> addSession(StudySession value) async {
    sessions.add(value);
    await save();
  }

  Future<void> addCard(Flashcard value) async {
    cards.add(value);
    await save();
  }

  Future<void> rateCard(Flashcard value, bool known) async {
    value.mastery = max(0, min(5, value.mastery + (known ? 1 : -1)));
    await save();
  }

  Future<void> addExam(ExamItem value) async {
    exams.add(value);
    await save();
  }

  Future<void> addNote(NoteItem value) async {
    notes.add(value);
    await save();
  }

  String backupJson() {
    return const JsonEncoder.withIndent('  ').convert({
      'product': 'Roshd',
      'studio': 'AdLand Studio',
      'version': '1.0.0',
      'settings': {
        'lang': lang,
        'goal': dailyGoal,
        'accent': accent,
        'alarm': alarm,
        'volume': volume,
        'light': mode == ThemeMode.light,
      },
      'tasks': tasks.map((e) => e.toJson()).toList(),
      'sessions': sessions.map((e) => e.toJson()).toList(),
      'subjects': subjects.map((e) => e.toJson()).toList(),
      'cards': cards.map((e) => e.toJson()).toList(),
      'exams': exams.map((e) => e.toJson()).toList(),
      'notes': notes.map((e) => e.toJson()).toList(),
    });
  }

  Future<bool> restoreJson(String raw) async {
    try {
      final m = jsonDecode(raw);
      if (m is! Map) return false;
      tasks
        ..clear()
        ..addAll((m['tasks'] as List? ?? [])
            .whereType<Map>()
            .map((e) => StudyTask.fromJson(Map<String, dynamic>.from(e))));
      sessions
        ..clear()
        ..addAll((m['sessions'] as List? ?? [])
            .whereType<Map>()
            .map((e) => StudySession.fromJson(Map<String, dynamic>.from(e))));
      subjects
        ..clear()
        ..addAll((m['subjects'] as List? ?? [])
            .whereType<Map>()
            .map((e) => SubjectItem.fromJson(Map<String, dynamic>.from(e))));
      cards
        ..clear()
        ..addAll((m['cards'] as List? ?? [])
            .whereType<Map>()
            .map((e) => Flashcard.fromJson(Map<String, dynamic>.from(e))));
      exams
        ..clear()
        ..addAll((m['exams'] as List? ?? [])
            .whereType<Map>()
            .map((e) => ExamItem.fromJson(Map<String, dynamic>.from(e))));
      notes
        ..clear()
        ..addAll((m['notes'] as List? ?? [])
            .whereType<Map>()
            .map((e) => NoteItem.fromJson(Map<String, dynamic>.from(e))));
      await save();
      return true;
    } catch (_) {
      return false;
    }
  }
}

class Notify {
  static final FlutterLocalNotificationsPlugin plugin = FlutterLocalNotificationsPlugin();

  static Future<void> init() async {
    const android = AndroidInitializationSettings('ic_launcher');
    const darwin = DarwinInitializationSettings(
      requestAlertPermission: false,
      requestBadgePermission: false,
      requestSoundPermission: false,
    );
    const windows = WindowsInitializationSettings(
      appName: 'Roshd',
      appUserModelId: 'com.adland.roshd',
      guid: '7d6a41f6-6a3d-4a3c-8c87-cfe0d1b6e2af',
    );
    await plugin.initialize(
      settings: const InitializationSettings(
        android: android,
        iOS: darwin,
        macOS: darwin,
        windows: windows,
      ),
    );
  }

  static Future<void> requestPermissions() async {
    await plugin
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
        ?.requestNotificationsPermission();
    await plugin
        .resolvePlatformSpecificImplementation<IOSFlutterLocalNotificationsPlugin>()
        ?.requestPermissions(alert: true, sound: true, badge: true);
    await plugin
        .resolvePlatformSpecificImplementation<MacOSFlutterLocalNotificationsPlugin>()
        ?.requestPermissions(alert: true, sound: true, badge: true);
  }

  static Future<void> show(String title, String body) async {
    const details = NotificationDetails(
      android: AndroidNotificationDetails(
        'roshd_focus',
        'Roshd Focus',
        channelDescription: 'Study focus alerts',
        importance: Importance.high,
        priority: Priority.high,
      ),
      iOS: DarwinNotificationDetails(),
      macOS: DarwinNotificationDetails(),
      windows: WindowsNotificationDetails(),
    );
    await plugin.show(
      id: DateTime.now().millisecondsSinceEpoch.remainder(2147483647),
      title: title,
      body: body,
      notificationDetails: details,
    );
  }
}

class SoundLab {
  final AudioPlayer player = AudioPlayer();

  Future<void> stop() => player.stop();

  Future<void> loop(String type, double volume) async {
    await player.setReleaseMode(ReleaseMode.loop);
    await player.setVolume(volume);
    await player.setSourceBytes(_makeAmbient(type), mimeType: 'audio/wav');
    await player.resume();
  }

  Future<void> alarm(String type, double volume) async {
    await player.setReleaseMode(ReleaseMode.stop);
    await player.setVolume(volume);
    await player.setSourceBytes(_makeAlarm(type), mimeType: 'audio/wav');
    await player.resume();
  }

  Uint8List _makeAmbient(String type) {
    const sampleRate = 8000;
    const seconds = 8;
    final output = Int16List(sampleRate * seconds);
    var seed = type.codeUnits.fold<int>(11, (a, b) => (a * 31 + b) & 0x7fffffff);
    var brown = 0.0;

    double noise() {
      seed = (1664525 * seed + 1013904223) & 0x7fffffff;
      return seed / 0x7fffffff * 2 - 1;
    }

    for (var i = 0; i < output.length; i++) {
      final t = i / sampleRate;
      var x = 0.0;

      if (type == 'rain') {
        x = noise() * .12;
        if (noise() > .997) {
          x += noise() * .35 * exp(-((t * 9) % 1) * 5);
        }
      } else if (type == 'ocean') {
        final swell = .5 + .5 * sin(t * .21);
        x = noise() * (.04 + .14 * swell);
      } else if (type == 'brown') {
        brown = brown * .985 + noise() * .02;
        x = brown * 3.2;
      } else if (type == 'white') {
        x = noise() * .15;
      } else if (type == 'focus') {
        x = sin(t * 2 * pi * 174) * .04 +
            sin(t * 2 * pi * 261) * .025 +
            sin(t * 2 * pi * 392) * .012 +
            noise() * .003;
      } else if (type == 'fire') {
        x = sin(t * 2 * pi * 70) * .026 + noise() * .025;
        if (noise() > .998) {
          x += noise() * .25;
        }
      } else {
        x = sin(t * 2 * pi * 110) * .022 +
            sin(t * 2 * pi * 164) * .012 +
            noise() * .014;
      }

      final fade = min(1.0, min(t * 3, (seconds - t) * 3));
      output[i] = (x * fade * 9000).clamp(-32767, 32767).toInt();
    }

    return _wav(output, sampleRate);
  }

  Uint8List _makeAlarm(String type) {
    const sampleRate = 12000;
    const seconds = 1.7;
    final output = Int16List((sampleRate * seconds).round());

    for (var i = 0; i < output.length; i++) {
      final t = i / sampleRate;
      double x;

      if (type == 'bell') {
        x = sin(2 * pi * 880 * t) * .38 +
            sin(2 * pi * 1320 * t) * .16;
      } else if (type == 'digital') {
        x = (sin(2 * pi * 980 * t) + sin(2 * pi * 1460 * t)) * .18;
      } else if (type == 'rise') {
        final f = 520 + 500 * min(1.0, t / seconds);
        x = sin(2 * pi * f * t) * .28;
      } else {
        x = sin(2 * pi * 523.25 * t) * .28 +
            sin(2 * pi * 659.25 * t) * .12;
      }

      final envelope = min(1.0, t * 14) *
          pow(max(0.0, 1 - t / seconds), 1.6);
      output[i] = (x * envelope * 15000).clamp(-32767, 32767).toInt();
    }

    return _wav(output, sampleRate);
  }

  Uint8List _wav(Int16List samples, int rate) {
    final dataLength = samples.length * 2;
    final buffer = ByteData(dataLength + 44);

    void ascii(int offset, String value) {
      for (var i = 0; i < value.length; i++) {
        buffer.setUint8(offset + i, value.codeUnitAt(i));
      }
    }

    ascii(0, 'RIFF');
    buffer.setUint32(4, 36 + dataLength, Endian.little);
    ascii(8, 'WAVE');
    ascii(12, 'fmt ');
    buffer.setUint32(16, 16, Endian.little);
    buffer.setUint16(20, 1, Endian.little);
    buffer.setUint16(22, 1, Endian.little);
    buffer.setUint32(24, rate, Endian.little);
    buffer.setUint32(28, rate * 2, Endian.little);
    buffer.setUint16(32, 2, Endian.little);
    buffer.setUint16(34, 16, Endian.little);
    ascii(36, 'data');
    buffer.setUint32(40, dataLength, Endian.little);

    for (var i = 0; i < samples.length; i++) {
      buffer.setInt16(44 + i * 2, samples[i], Endian.little);
    }

    return buffer.buffer.asUint8List();
  }

  void dispose() => player.dispose();
}

class RoshdApp extends StatelessWidget {
  final RoshdStore store;

  const RoshdApp({super.key, required this.store});

  @override
  Widget build(BuildContext context) {
    final isFa = store.lang == 'fa';
    final seed = switch (store.accent) {
      'violet' => const Color(0xff8a7cff),
      'gold' => const Color(0xffd9b55d),
      'mint' => const Color(0xff7bf6df),
      _ => const Color(0xff6d8cff),
    };

    final scheme = ColorScheme.fromSeed(
      seedColor: seed,
      brightness: store.mode == ThemeMode.dark
          ? Brightness.dark
          : Brightness.light,
    );

    final theme = ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      brightness: scheme.brightness,
      fontFamily: isFa
          ? GoogleFonts.vazirmatn().fontFamily
          : GoogleFonts.manrope().fontFamily,
      scaffoldBackgroundColor: store.mode == ThemeMode.dark
          ? const Color(0xff060914)
          : const Color(0xfff3f6fb),
      cardTheme: CardThemeData(
        margin: EdgeInsets.zero,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(22),
        ),
      ),
    );

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Roshd | رشد',
      theme: theme,
      home: Directionality(
        textDirection: isFa ? ui.TextDirection.rtl : ui.TextDirection.ltr,
        child: Shell(store: store),
      ),
    );
  }
}

class Shell extends StatefulWidget {
  final RoshdStore store;

  const Shell({super.key, required this.store});

  @override
  State<Shell> createState() => _ShellState();
}

class _ShellState extends State<Shell> {
  final SoundLab audio = SoundLab();

  @override
  void dispose() {
    audio.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final store = widget.store;
    final isFa = store.lang == 'fa';
    final labels = isFa
        ? ['خانه', 'برنامه', 'تمرکز', 'یادگیری', 'تحلیل', 'بیشتر']
        : ['Home', 'Planner', 'Focus', 'Learn', 'Insights', 'More'];
    final icons = [
      Icons.home_rounded,
      Icons.calendar_month_rounded,
      Icons.timer_rounded,
      Icons.school_rounded,
      Icons.insights_rounded,
      Icons.tune_rounded,
    ];
    final desktop = MediaQuery.sizeOf(context).width >= 900;

    final pages = [
      HomePage(store: store),
      PlannerPage(store: store),
      FocusPage(store: store, audio: audio),
      LearnPage(store: store),
      InsightsPage(store: store),
      MorePage(store: store, audio: audio),
    ];

    return Scaffold(
      body: Stack(
        children: [
          const Positioned.fill(child: RoshdAura()),
          SafeArea(
            child: Row(
              children: [
                if (desktop)
                  Padding(
                    padding: const EdgeInsets.all(12),
                    child: NavigationRail(
                      selectedIndex: store.tab,
                      onDestinationSelected: store.setTab,
                      labelType: NavigationRailLabelType.all,
                      backgroundColor: Colors.transparent,
                      leading: const Padding(
                        padding: EdgeInsets.only(bottom: 16),
                        child: RoshdBrand(),
                      ),
                      destinations: List.generate(
                        labels.length,
                        (index) => NavigationRailDestination(
                          icon: Icon(icons[index]),
                          selectedIcon: Icon(icons[index]),
                          label: Text(labels[index]),
                        ),
                      ),
                    ),
                  ),
                Expanded(
                  child: Padding(
                    padding: EdgeInsets.fromLTRB(
                      desktop ? 8 : 12,
                      12,
                      desktop ? 16 : 12,
                      desktop ? 12 : 8,
                    ),
                    child: Column(
                      children: [
                        RoshdTopBar(store: store),
                        const SizedBox(height: 12),
                        Expanded(
                          child: AnimatedSwitcher(
                            duration: const Duration(milliseconds: 280),
                            child: KeyedSubtree(
                              key: ValueKey(store.tab),
                              child: pages[store.tab],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: desktop
          ? null
          : NavigationBar(
              selectedIndex: store.tab,
              onDestinationSelected: store.setTab,
              destinations: List.generate(
                labels.length,
                (index) => NavigationDestination(
                  icon: Icon(icons[index]),
                  label: labels[index],
                ),
              ),
            ),
    );
  }
}

class RoshdAura extends StatefulWidget {
  const RoshdAura({super.key});

  @override
  State<RoshdAura> createState() => _RoshdAuraState();
}

class _RoshdAuraState extends State<RoshdAura>
    with SingleTickerProviderStateMixin {
  late final AnimationController controller = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 16),
  )..repeat();

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (_, __) => CustomPaint(
        painter: AuraPainter(controller.value),
        child: const SizedBox.expand(),
      ),
    );
  }
}

class AuraPainter extends CustomPainter {
  final double value;

  AuraPainter(this.value);

  @override
  void paint(Canvas canvas, Size size) {
    final points = [
      Offset(
        size.width * (.12 + .04 * sin(value * 2 * pi)),
        size.height * .10,
      ),
      Offset(
        size.width * .90,
        size.height * (.35 + .05 * cos(value * 2 * pi)),
      ),
      Offset(size.width * .50, size.height * .92),
    ];
    final colors = [
      const Color(0xff6d8cff),
      const Color(0xffd9b55d),
      const Color(0xff7bf6df),
    ];
    final paint = Paint();

    for (var i = 0; i < points.length; i++) {
      paint.shader = RadialGradient(
        colors: [colors[i].withOpacity(.08), Colors.transparent],
      ).createShader(
        Rect.fromCircle(
          center: points[i],
          radius: size.shortestSide * .40,
        ),
      );
      canvas.drawCircle(points[i], size.shortestSide * .40, paint);
    }
  }

  @override
  bool shouldRepaint(covariant AuraPainter oldDelegate) => true;
}

class RoshdBrand extends StatelessWidget {
  const RoshdBrand({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 52,
      height: 52,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: const LinearGradient(
          colors: [
            Color(0xfff4d47c),
            Color(0xff7bf6df),
            Color(0xff8a7cff),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0xff7bf6df),
            blurRadius: 20,
            spreadRadius: -9,
          ),
        ],
      ),
      child: const Icon(
        Icons.menu_book_rounded,
        color: Color(0xff06101a),
      ),
    );
  }
}

class RoshdTopBar extends StatelessWidget {
  final RoshdStore store;

  const RoshdTopBar({super.key, required this.store});

  @override
  Widget build(BuildContext context) {
    final isFa = store.lang == 'fa';

    return GlassPanel(
      child: Row(
        children: [
          const RoshdBrand(),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Roshd | رشد',
                  style: Theme.of(context)
                      .textTheme
                      .titleLarge
                      ?.copyWith(fontWeight: FontWeight.w900),
                ),
                Text(
                  isFa
                      ? 'میز مطالعه و برنامه‌ریزی فارسی‌محور'
                      : 'Persian-first study workspace',
                  style: Theme.of(context).textTheme.labelMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
          Chip(
            avatar: const Icon(Icons.auto_awesome, size: 15),
            label: const Text('AdLand Studio'),
          ),
          IconButton(
            tooltip: isFa ? 'تغییر زبان' : 'Change language',
            onPressed: () => store.setLang(isFa ? 'en' : 'fa'),
            icon: const Icon(Icons.translate_rounded),
          ),
        ],
      ),
    );
  }
}

class GlassPanel extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;

  const GlassPanel({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16),
  });

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: dark
            ? const Color(0xff0d1221).withOpacity(.86)
            : Colors.white.withOpacity(.92),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: Theme.of(context).colorScheme.outlineVariant.withOpacity(.22),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(.08),
            blurRadius: 40,
            offset: const Offset(0, 18),
          ),
        ],
      ),
      child: child,
    );
  }
}

class Pill extends StatelessWidget {
  final String text;
  final IconData icon;

  const Pill({super.key, required this.text, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Chip(
      avatar: Icon(icon, size: 16),
      label: Text(text),
    );
  }
}

class HomePage extends StatelessWidget {
  final RoshdStore store;

  const HomePage({super.key, required this.store});

  @override
  Widget build(BuildContext context) {
    final isFa = store.lang == 'fa';
    final today = store.todayTasks();
    final completed = today.where((x) => x.done).length;
    final sortedExams = [...store.exams]
      ..sort((a, b) => a.at.compareTo(b.at));
    final nextExam = firstOrNull(
      sortedExams.where((x) => x.at.isAfter(DateTime.now())),
    );
    final width = MediaQuery.sizeOf(context).width;

    return ListView(
      children: [
        GlassPanel(
          padding: const EdgeInsets.all(22),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  Pill(
                    text: isFa
                        ? 'ویژه دانش‌آموزان تیزهوشانی'
                        : 'For high-achieving students',
                    icon: Icons.workspace_premium_rounded,
                  ),
                  Pill(
                    text: isFa ? 'فارسی‌محور' : 'Persian-first',
                    icon: Icons.language_rounded,
                  ),
                ],
              ),
              const SizedBox(height: 14),
              Text(
                isFa
                    ? 'امروز را واضح کن؛ بعد فقط یک قدم جلو برو.'
                    : 'Make today clear. Then take one step.',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.w900,
                  height: 1.1,
                ),
              ),
              const SizedBox(height: 9),
              Text(
                isFa
                    ? 'رشد برنامه‌ریزی، تمرکز، مرور، آزمون و تحلیل را در یک میز مطالعه جمع می‌کند.'
                    : 'Roshd combines planning, focus, review, exams and analytics in one study workspace.',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                  height: 1.8,
                ),
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  FilledButton.icon(
                    onPressed: () => store.setTab(2),
                    icon: const Icon(Icons.play_arrow_rounded),
                    label: Text(isFa ? 'شروع تمرکز' : 'Start focus'),
                  ),
                  OutlinedButton.icon(
                    onPressed: () => store.setTab(1),
                    icon: const Icon(Icons.add_task_rounded),
                    label: Text(isFa ? 'افزودن برنامه' : 'Add plan'),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        GridView.count(
          crossAxisCount: width > 1100 ? 4 : 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
          childAspectRatio: width > 1100 ? 2.1 : 2.4,
          children: [
            MetricCard(
              icon: Icons.timer_rounded,
              value: store.todayMinutes().toString(),
              label: isFa ? 'دقیقه مطالعه امروز' : 'Study minutes today',
            ),
            MetricCard(
              icon: Icons.check_circle_rounded,
              value: completed.toString() + '/' + today.length.toString(),
              label: isFa ? 'کارهای امروز' : 'Today tasks',
            ),
            MetricCard(
              icon: Icons.local_fire_department_rounded,
              value: store.streak().toString(),
              label: isFa ? 'روز زنجیره' : 'Day streak',
            ),
            MetricCard(
              icon: Icons.event_rounded,
              value: nextExam == null
                  ? '—'
                  : max(
                      0,
                      nextExam.at.difference(DateTime.now()).inDays,
                    ).toString(),
              label: isFa ? 'روز تا آزمون' : 'Days to exam',
            ),
          ],
        ),
        const SizedBox(height: 12),
        GlassPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              PanelHeader(
                title: isFa ? 'برنامهٔ امروز' : 'Today plan',
                onTap: () => store.setTab(1),
              ),
              if (today.isEmpty)
                EmptyMessage(
                  text: isFa
                      ? 'هنوز برنامه‌ای برای امروز نداری.'
                      : 'No study blocks planned for today.',
                )
              else
                ...today.take(6).map(
                  (task) => ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: Checkbox(
                      value: task.done,
                      onChanged: (_) => store.toggleTask(task),
                    ),
                    title: Text(
                      task.title,
                      style: TextStyle(
                        fontWeight: FontWeight.w800,
                        decoration:
                            task.done ? TextDecoration.lineThrough : null,
                      ),
                    ),
                    subtitle: Text(
                      task.subject +
                          ' · ' +
                          task.minutes.toString() +
                          ' دقیقه · ' +
                          timeLabel(task.at),
                    ),
                    trailing: PriorityDot(priority: task.priority),
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        GlassPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              PanelHeader(
                title: isFa ? 'نبض درس‌ها' : 'Subject pulse',
              ),
              const SizedBox(height: 10),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: store.subjects.map((subject) {
                  final minutes = store.subjectMinutes(subject.name);
                  final progress = subject.goal <= 0
                      ? 0.0
                      : min(
                          1.0,
                          minutes / subject.goal,
                        );
                  return SizedBox(
                    width: 220,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          subject.name,
                          style: const TextStyle(
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 7),
                        LinearProgressIndicator(
                          value: progress,
                          color: Color(subject.color),
                          minHeight: 8,
                        ),
                        const SizedBox(height: 5),
                        Text(
                          minutes.toString() +
                              ' / ' +
                              subject.goal.toString() +
                              ' min',
                          style: Theme.of(context)
                              .textTheme
                              .labelSmall
                              ?.copyWith(
                                color: Theme.of(context)
                                    .colorScheme
                                    .onSurfaceVariant,
                              ),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class MetricCard extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;

  const MetricCard({
    super.key,
    required this.icon,
    required this.value,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return GlassPanel(
      padding: const EdgeInsets.all(14),
      child: Row(
        children: [
          Icon(icon),
          const SizedBox(width: 9),
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  value,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w900,
                  ),
                ),
                Text(
                  label,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context)
                      .textTheme
                      .labelSmall
                      ?.copyWith(
                        color:
                            Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class PanelHeader extends StatelessWidget {
  final String title;
  final VoidCallback? onTap;

  const PanelHeader({super.key, required this.title, this.onTap});

  @override
  Widget build(BuildContext context) {
    final rtl = Directionality.of(context) == ui.TextDirection.rtl;
    return Row(
      children: [
        Expanded(
          child: Text(
            title,
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w900,
            ),
          ),
        ),
        if (onTap != null)
          TextButton(
            onPressed: onTap,
            child: Text(rtl ? 'باز کردن' : 'Open'),
          ),
      ],
    );
  }
}

class EmptyMessage extends StatelessWidget {
  final String text;

  const EmptyMessage({super.key, required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 24),
      child: Center(
        child: Text(
          text,
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
        ),
      ),
    );
  }
}

class PriorityDot extends StatelessWidget {
  final int priority;

  const PriorityDot({super.key, required this.priority});

  @override
  Widget build(BuildContext context) {
    final color = priority == 3
        ? Colors.redAccent
        : priority == 1
            ? const Color(0xff7bf6df)
            : const Color(0xfff4d47c);

    return Container(
      width: 10,
      height: 10,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(color: color.withOpacity(.30), blurRadius: 8),
        ],
      ),
    );
  }
}

class PlannerPage extends StatefulWidget {
  final RoshdStore store;

  const PlannerPage({super.key, required this.store});

  @override
  State<PlannerPage> createState() => _PlannerPageState();
}

class _PlannerPageState extends State<PlannerPage> {
  DateTime day = DateTime.now();

  Future<void> addTaskDialog() async {
    final title = TextEditingController();
    final minutes = TextEditingController(text: '45');
    var subject = firstOrNull(widget.store.subjects)?.name ?? 'عمومی';
    var priority = 2;
    final isFa = widget.store.lang == 'fa';
    final time = TimeOfDay.now();

    await showDialog<void>(
      context: context,
      builder: (dialogContext) {
        return StatefulBuilder(
          builder: (dialogContext, setDialogState) {
            return AlertDialog(
              title: Text(isFa ? 'بلوک مطالعه جدید' : 'New study block'),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: title,
                      decoration: InputDecoration(
                        labelText: isFa ? 'عنوان' : 'Title',
                      ),
                    ),
                    const SizedBox(height: 10),
                    DropdownButtonFormField<String>(
                      initialValue: subject,
                      items: widget.store.subjects
                          .map(
                            (item) => DropdownMenuItem(
                              value: item.name,
                              child: Text(item.name),
                            ),
                          )
                          .toList(),
                      onChanged: (value) {
                        setDialogState(() {
                          subject = value ?? subject;
                        });
                      },
                      decoration: InputDecoration(
                        labelText: isFa ? 'درس' : 'Subject',
                      ),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: minutes,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(
                        labelText: isFa ? 'دقیقه' : 'Minutes',
                      ),
                    ),
                    const SizedBox(height: 10),
                    SegmentedButton<int>(
                      segments: [
                        ButtonSegment(
                          value: 1,
                          label: Text(isFa ? 'کم' : 'Low'),
                        ),
                        ButtonSegment(
                          value: 2,
                          label: Text(isFa ? 'عادی' : 'Normal'),
                        ),
                        ButtonSegment(
                          value: 3,
                          label: Text(isFa ? 'مهم' : 'High'),
                        ),
                      ],
                      selected: {priority},
                      onSelectionChanged: (values) {
                        setDialogState(() {
                          priority = values.first;
                        });
                      },
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(dialogContext),
                  child: Text(isFa ? 'لغو' : 'Cancel'),
                ),
                FilledButton(
                  onPressed: () async {
                    final clean = title.text.trim();
                    if (clean.isEmpty) return;
                    final taskDate = DateTime(
                      day.year,
                      day.month,
                      day.day,
                      time.hour,
                      time.minute,
                    );
                    await widget.store.addTask(
                      StudyTask(
                        id: makeId(),
                        title: clean,
                        subject: subject,
                        at: taskDate,
                        minutes: max(
                          5,
                          int.tryParse(minutes.text) ?? 45,
                        ),
                        priority: priority,
                      ),
                    );
                    if (mounted) {
                      Navigator.pop(dialogContext);
                    }
                  },
                  child: Text(isFa ? 'افزودن' : 'Add'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Future<void> buildSmartPlan() async {
    final source = [...widget.store.tasks.where((x) => !x.done)]
      ..sort((a, b) => b.priority.compareTo(a.priority));

    final candidates = source.isNotEmpty
        ? source.take(4).toList()
        : widget.store.subjects
              .take(4)
              .map(
                (item) => StudyTask(
                  id: makeId(),
                  title: widget.store.lang == 'fa'
                      ? 'مرور ' + item.name
                      : 'Review ' + item.name,
                  subject: item.name,
                  at: DateTime.now(),
                  minutes: 40,
                ),
              )
              .toList();

    var cursor = DateTime.now().add(const Duration(minutes: 10));

    for (final item in candidates) {
      final duration = item.minutes.clamp(20, 90).toInt();
      await widget.store.addTask(
        StudyTask(
          id: makeId(),
          title: item.title,
          subject: item.subject,
          at: cursor,
          minutes: duration,
          priority: item.priority,
        ),
      );
      cursor = cursor.add(Duration(minutes: duration + 10));
    }

    if (mounted) {
      final isFa = widget.store.lang == 'fa';
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            isFa
                ? 'برنامهٔ پیشنهادی ساخته شد.'
                : 'Suggested plan created.',
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isFa = widget.store.lang == 'fa';
    final dayTasks = widget.store.tasks
        .where((x) => sameDay(x.at, day))
        .toList()
      ..sort((a, b) => a.at.compareTo(b.at));

    return ListView(
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                isFa ? 'برنامه‌ریز' : 'Planner',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
            FilledButton.icon(
              onPressed: buildSmartPlan,
              icon: const Icon(Icons.auto_awesome_rounded),
              label: Text(isFa ? 'برنامه‌ریز خودکار' : 'Smart plan'),
            ),
            const SizedBox(width: 8),
            IconButton.filled(
              onPressed: addTaskDialog,
              icon: const Icon(Icons.add_rounded),
            ),
          ],
        ),
        const SizedBox(height: 12),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: List.generate(7, (index) {
              final current = DateTime.now().add(
                Duration(days: index - 2),
              );
              return Padding(
                padding: const EdgeInsets.only(right: 7),
                child: ChoiceChip(
                  selected: sameDay(current, day),
                  label: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        index == 2
                            ? (isFa ? 'امروز' : 'Today')
                            : DateFormat('EEE').format(current),
                      ),
                      Text(dateLabel(current, widget.store.lang)),
                    ],
                  ),
                  onSelected: (_) {
                    setState(() {
                      day = current;
                    });
                  },
                ),
              );
            }),
          ),
        ),
        const SizedBox(height: 12),
        GlassPanel(
          child: dayTasks.isEmpty
              ? EmptyMessage(
                  text: isFa
                      ? 'این روز خالی است. یک بلوک مطالعه اضافه کن.'
                      : 'This day is empty. Add a study block.',
                )
              : Column(
                  children: dayTasks
                      .map(
                        (task) => Dismissible(
                          key: ValueKey(task.id),
                          background: Container(
                            decoration: BoxDecoration(
                              color: Colors.red.withOpacity(.08),
                              borderRadius: BorderRadius.circular(14),
                            ),
                          ),
                          onDismissed: (_) => widget.store.deleteTask(task),
                          child: ListTile(
                            contentPadding: EdgeInsets.zero,
                            leading: Checkbox(
                              value: task.done,
                              onChanged: (_) =>
                                  widget.store.toggleTask(task),
                            ),
                            title: Text(
                              task.title,
                              style: TextStyle(
                                fontWeight: FontWeight.w800,
                                decoration: task.done
                                    ? TextDecoration.lineThrough
                                    : null,
                              ),
                            ),
                            subtitle: Text(
                              task.subject +
                                  ' · ' +
                                  task.minutes.toString() +
                                  ' دقیقه · ' +
                                  timeLabel(task.at),
                            ),
                            trailing: PriorityDot(
                              priority: task.priority,
                            ),
                          ),
                        ),
                      )
                      .toList(),
                ),
        ),
      ],
    );
  }
}

class FocusPage extends StatefulWidget {
  final RoshdStore store;
  final SoundLab audio;

  const FocusPage({
    super.key,
    required this.store,
    required this.audio,
  });

  @override
  State<FocusPage> createState() => _FocusPageState();
}

class _FocusPageState extends State<FocusPage> {
  Timer? ticker;
  int focusMinutes = 25;
  int breakMinutes = 5;
  Duration remaining = const Duration(minutes: 25);
  bool running = false;
  bool isFocus = true;
  String subject = 'عمومی';
  String scene = 'focus';
  int plannedSeconds = 25 * 60;

  @override
  void initState() {
    super.initState();
    subject = firstOrNull(widget.store.subjects)?.name ?? 'عمومی';
  }

  @override
  void dispose() {
    ticker?.cancel();
    super.dispose();
  }

  void setFocusDuration(int minutes) {
    ticker?.cancel();
    setState(() {
      focusMinutes = minutes;
      remaining = Duration(minutes: minutes);
      plannedSeconds = minutes * 60;
      running = false;
      isFocus = true;
    });
  }

  Future<void> toggleTimer() async {
    if (running) {
      ticker?.cancel();
      setState(() {
        running = false;
      });
      return;
    }

    if (remaining.inSeconds <= 0) {
      remaining = Duration(
        minutes: isFocus ? focusMinutes : breakMinutes,
      );
      plannedSeconds = remaining.inSeconds;
    }

    if (widget.store.sounds) {
      try {
        await widget.audio.loop(
          scene,
          widget.store.volume * .5,
        );
      } catch (_) {}
    }

    setState(() {
      running = true;
    });

    ticker = Timer.periodic(
      const Duration(seconds: 1),
      (timer) async {
        if (!mounted) {
          timer.cancel();
          return;
        }

        if (remaining.inSeconds <= 1) {
          timer.cancel();
          final finishedFocus = isFocus;
          final minutesLogged = max(
            1,
            plannedSeconds ~/ 60,
          );

          if (finishedFocus) {
            await widget.store.addSession(
              StudySession(
                at: DateTime.now(),
                minutes: minutesLogged,
                subject: subject,
              ),
            );
          }

          if (widget.store.sounds) {
            try {
              await widget.audio.alarm(
                widget.store.alarm,
                widget.store.volume,
              );
            } catch (_) {}
          }

          if (widget.store.notifications) {
            await Notify.show(
              finishedFocus
                  ? 'Roshd · زمان استراحت'
                  : 'Roshd · وقت تمرکز',
              finishedFocus
                  ? 'چند دقیقه استراحت کن و برگرد.'
                  : 'استراحت تمام شد. آمادهٔ تمرکز بعدی هستی؟',
            );
          }

          if (!mounted) return;

          setState(() {
            isFocus = !isFocus;
            remaining = Duration(
              minutes: isFocus ? focusMinutes : breakMinutes,
            );
            plannedSeconds = remaining.inSeconds;
            running = false;
          });
        } else {
          setState(() {
            remaining -= const Duration(seconds: 1);
          });
        }
      },
    );
  }

  void resetTimer() {
    ticker?.cancel();
    setState(() {
      running = false;
      isFocus = true;
      remaining = Duration(minutes: focusMinutes);
      plannedSeconds = focusMinutes * 60;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isFa = widget.store.lang == 'fa';
    final ratio = plannedSeconds <= 0
        ? 0.0
        : 1.0 - remaining.inSeconds / plannedSeconds;
    final minutes = remaining.inMinutes.remainder(60).toString().padLeft(2, '0');
    final seconds = remaining.inSeconds.remainder(60).toString().padLeft(2, '0');

    return ListView(
      children: [
        Text(
          isFa ? 'اتاق تمرکز' : 'Focus room',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.w900,
          ),
        ),
        const SizedBox(height: 12),
        GlassPanel(
          padding: EdgeInsets.zero,
          child: LayoutBuilder(
            builder: (context, constraints) {
              final rowLayout = constraints.maxWidth > 760;
              final timerCard = SizedBox(
                height: 430,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    CustomPaint(
                      size: const Size(330, 330),
                      painter: TimerPainter(
                        ratio,
                        isFocus
                            ? const Color(0xff7bf6df)
                            : const Color(0xff8a7cff),
                      ),
                    ),
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          isFocus ? 'FOCUS' : 'BREAK',
                          style: TextStyle(
                            letterSpacing: 5,
                            fontWeight: FontWeight.w900,
                            color: isFocus
                                ? const Color(0xff7bf6df)
                                : const Color(0xff8a7cff),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          minutes + ':' + seconds,
                          style: Theme.of(context)
                              .textTheme
                              .displayLarge
                              ?.copyWith(fontWeight: FontWeight.w900),
                        ),
                        Text(
                          running
                              ? (isFa ? '● در حال اجرا' : '● Running')
                              : (isFa ? 'آماده' : 'Ready'),
                          style: Theme.of(context)
                              .textTheme
                              .labelLarge
                              ?.copyWith(
                                color: Theme.of(context)
                                    .colorScheme
                                    .onSurfaceVariant,
                              ),
                        ),
                      ],
                    ),
                  ],
                ),
              );

              final controls = Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      isFa ? 'جلسه' : 'Session',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 10),
                    SegmentedButton<int>(
                      segments: const [
                        ButtonSegment(value: 25, label: Text('25')),
                        ButtonSegment(value: 45, label: Text('45')),
                        ButtonSegment(value: 60, label: Text('60')),
                      ],
                      selected: {focusMinutes},
                      onSelectionChanged: (values) {
                        setFocusDuration(values.first);
                      },
                    ),
                    const SizedBox(height: 10),
                    DropdownButtonFormField<String>(
                      initialValue: subject,
                      items: widget.store.subjects
                          .map(
                            (item) => DropdownMenuItem(
                              value: item.name,
                              child: Text(item.name),
                            ),
                          )
                          .toList(),
                      onChanged: (value) {
                        setState(() {
                          subject = value ?? subject;
                        });
                      },
                      decoration: InputDecoration(
                        labelText: isFa ? 'درس' : 'Subject',
                      ),
                    ),
                    const SizedBox(height: 12),
                    FilledButton.icon(
                      onPressed: toggleTimer,
                      icon: Icon(
                        running
                            ? Icons.pause_rounded
                            : Icons.play_arrow_rounded,
                      ),
                      label: Text(
                        running
                            ? (isFa ? 'مکث' : 'Pause')
                            : (isFa ? 'شروع تمرکز' : 'Start focus'),
                      ),
                    ),
                    const SizedBox(height: 8),
                    OutlinedButton.icon(
                      onPressed: resetTimer,
                      icon: const Icon(Icons.restart_alt_rounded),
                      label: Text(isFa ? 'بازنشانی' : 'Reset'),
                    ),
                    const SizedBox(height: 12),
                    Text(isFa ? 'صدای پایان جلسه' : 'End alarm'),
                    const SizedBox(height: 6),
                    DropdownButtonFormField<String>(
                      initialValue: widget.store.alarm,
                      items: const [
                        DropdownMenuItem(
                          value: 'soft',
                          child: Text('Soft Bloom'),
                        ),
                        DropdownMenuItem(
                          value: 'bell',
                          child: Text('Study Bell'),
                        ),
                        DropdownMenuItem(
                          value: 'digital',
                          child: Text('Digital Tick'),
                        ),
                        DropdownMenuItem(
                          value: 'rise',
                          child: Text('Rise'),
                        ),
                      ],
                      onChanged: (value) {
                        widget.store.alarm = value ?? widget.store.alarm;
                        widget.store.save();
                      },
                    ),
                    Row(
                      children: [
                        const Icon(Icons.volume_up_rounded),
                        Expanded(
                          child: Slider(
                            value: widget.store.volume,
                            onChanged: (value) {
                              widget.store.volume = value;
                            },
                            onChangeEnd: (_) => widget.store.save(),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );

              return rowLayout
                  ? Row(
                      children: [
                        Expanded(flex: 6, child: timerCard),
                        Expanded(flex: 4, child: controls),
                      ],
                    )
                  : Column(
                      children: [
                        timerCard,
                        controls,
                      ],
                    );
            },
          ),
        ),
        const SizedBox(height: 12),
        GlassPanel(
          child: SoundScenePicker(
            store: widget.store,
            audio: widget.audio,
            selected: scene,
            onSelected: (value) {
              setState(() {
                scene = value;
              });
            },
          ),
        ),
      ],
    );
  }
}

class TimerPainter extends CustomPainter {
  final double progress;
  final Color color;

  TimerPainter(this.progress, this.color);

  @override
  void paint(Canvas canvas, Size size) {
    final center = size.center(Offset.zero);
    final radius = min(size.width, size.height) * .38;
    final base = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 17
      ..color = Colors.white10;
    final active = Paint()
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeWidth = 17
      ..color = color;

    canvas.drawCircle(center, radius, base);
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -pi / 2,
      2 * pi * progress,
      false,
      active,
    );
  }

  @override
  bool shouldRepaint(covariant TimerPainter oldDelegate) {
    return oldDelegate.progress != progress ||
        oldDelegate.color != color;
  }
}

class SoundScenePicker extends StatelessWidget {
  final RoshdStore store;
  final SoundLab audio;
  final String selected;
  final ValueChanged<String> onSelected;

  const SoundScenePicker({
    super.key,
    required this.store,
    required this.audio,
    required this.selected,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    final isFa = store.lang == 'fa';
    final scenes = [
      ('rain', isFa ? 'باران نرم' : 'Soft Rain', Icons.grain_rounded),
      ('ocean', isFa ? 'موج آرام' : 'Calm Ocean', Icons.water_rounded),
      ('brown', isFa ? 'نویز قهوه‌ای' : 'Brown Noise', Icons.graphic_eq_rounded),
      ('white', isFa ? 'نویز سفید' : 'White Noise', Icons.blur_on_rounded),
      ('focus', isFa ? 'پد تمرکز' : 'Focus Pad', Icons.spa_rounded),
      ('fire', isFa ? 'آتش آرام' : 'Quiet Fire', Icons.local_fire_department_rounded),
      ('night', isFa ? 'هوای شب' : 'Night Air', Icons.nightlight_rounded),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PanelHeader(title: isFa ? 'فضای مطالعه' : 'Study atmosphere'),
        Text(
          isFa
              ? 'صداهای داخلیِ تولیدشده؛ بدون سرویس موسیقی خارجی.'
              : 'Built-in generated soundscapes; no external music service.',
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
        ),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: scenes.map((scene) {
            return ChoiceChip(
              selected: selected == scene.$1,
              avatar: Icon(scene.$3, size: 16),
              label: Text(scene.$2),
              onSelected: (_) async {
                onSelected(scene.$1);
                if (store.sounds) {
                  try {
                    await audio.loop(
                      scene.$1,
                      store.volume * .5,
                    );
                  } catch (_) {}
                }
              },
            );
          }).toList(),
        ),
        const SizedBox(height: 10),
        OutlinedButton.icon(
          onPressed: audio.stop,
          icon: const Icon(Icons.stop_rounded),
          label: Text(isFa ? 'توقف صدا' : 'Stop sound'),
        ),
      ],
    );
  }
}

class LearnPage extends StatefulWidget {
  final RoshdStore store;

  const LearnPage({super.key, required this.store});

  @override
  State<LearnPage> createState() => _LearnPageState();
}

class _LearnPageState extends State<LearnPage>
    with SingleTickerProviderStateMixin {
  late final TabController tabs = TabController(
    length: 4,
    vsync: this,
  );

  @override
  void dispose() {
    tabs.dispose();
    super.dispose();
  }

  Future<void> addFlashcard() async {
    final front = TextEditingController();
    final back = TextEditingController();
    final deck = TextEditingController(text: 'عمومی');
    final isFa = widget.store.lang == 'fa';

    await showDialog<void>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text(isFa ? 'فلش‌کارت جدید' : 'New flashcard'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: deck,
              decoration: InputDecoration(
                labelText: isFa ? 'دسته' : 'Deck',
              ),
            ),
            TextField(
              controller: front,
              decoration: InputDecoration(
                labelText: isFa ? 'سؤال' : 'Front',
              ),
            ),
            TextField(
              controller: back,
              decoration: InputDecoration(
                labelText: isFa ? 'پاسخ' : 'Back',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: Text(isFa ? 'لغو' : 'Cancel'),
          ),
          FilledButton(
            onPressed: () async {
              if (front.text.trim().isEmpty ||
                  back.text.trim().isEmpty) {
                return;
              }
              await widget.store.addCard(
                Flashcard(
                  id: makeId(),
                  deck: deck.text.trim(),
                  front: front.text.trim(),
                  back: back.text.trim(),
                ),
              );
              if (mounted) {
                Navigator.pop(dialogContext);
              }
            },
            child: Text(isFa ? 'افزودن' : 'Add'),
          ),
        ],
      ),
    );
  }

  Future<void> addNote() async {
    final title = TextEditingController();
    final body = TextEditingController();
    var subject = firstOrNull(widget.store.subjects)?.name ?? 'عمومی';
    final isFa = widget.store.lang == 'fa';

    await showDialog<void>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (dialogContext, setDialogState) => AlertDialog(
          title: Text(isFa ? 'یادداشت جدید' : 'New note'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: title,
                decoration: InputDecoration(
                  labelText: isFa ? 'عنوان' : 'Title',
                ),
              ),
              TextField(
                controller: body,
                maxLines: 5,
                decoration: InputDecoration(
                  labelText: isFa ? 'متن' : 'Body',
                ),
              ),
              DropdownButtonFormField<String>(
                initialValue: subject,
                items: widget.store.subjects
                    .map(
                      (item) => DropdownMenuItem(
                        value: item.name,
                        child: Text(item.name),
                      ),
                    )
                    .toList(),
                onChanged: (value) {
                  setDialogState(() {
                    subject = value ?? subject;
                  });
                },
                decoration: InputDecoration(
                  labelText: isFa ? 'درس' : 'Subject',
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext),
              child: Text(isFa ? 'لغو' : 'Cancel'),
            ),
            FilledButton(
              onPressed: () async {
                if (title.text.trim().isEmpty) return;
                await widget.store.addNote(
                  NoteItem(
                    id: makeId(),
                    title: title.text.trim(),
                    body: body.text.trim(),
                    subject: subject,
                    at: DateTime.now(),
                  ),
                );
                if (mounted) {
                  Navigator.pop(dialogContext);
                }
              },
              child: Text(isFa ? 'ذخیره' : 'Save'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> addExam() async {
    final title = TextEditingController();
    final isFa = widget.store.lang == 'fa';
    var subject = firstOrNull(widget.store.subjects)?.name ?? 'عمومی';

    final date = await showDatePicker(
      context: context,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 1095)),
      initialDate: DateTime.now().add(const Duration(days: 14)),
    );

    if (date == null) return;

    if (!mounted) return;

    await showDialog<void>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (dialogContext, setDialogState) => AlertDialog(
          title: Text(isFa ? 'آزمون جدید' : 'New exam'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: title,
                decoration: InputDecoration(
                  labelText: isFa ? 'عنوان آزمون' : 'Exam title',
                ),
              ),
              DropdownButtonFormField<String>(
                initialValue: subject,
                items: widget.store.subjects
                    .map(
                      (item) => DropdownMenuItem(
                        value: item.name,
                        child: Text(item.name),
                      ),
                    )
                    .toList(),
                onChanged: (value) {
                  setDialogState(() {
                    subject = value ?? subject;
                  });
                },
                decoration: InputDecoration(
                  labelText: isFa ? 'درس' : 'Subject',
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext),
              child: Text(isFa ? 'لغو' : 'Cancel'),
            ),
            FilledButton(
              onPressed: () async {
                if (title.text.trim().isEmpty) return;
                await widget.store.addExam(
                  ExamItem(
                    id: makeId(),
                    title: title.text.trim(),
                    subject: subject,
                    at: date,
                  ),
                );
                if (mounted) {
                  Navigator.pop(dialogContext);
                }
              },
              child: Text(isFa ? 'ثبت' : 'Add'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isFa = widget.store.lang == 'fa';

    return Column(
      children: [
        Text(
          isFa ? 'یادگیری' : 'Learn',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.w900,
          ),
        ),
        const SizedBox(height: 8),
        TabBar(
          controller: tabs,
          tabs: [
            Tab(text: isFa ? 'فلش‌کارت' : 'Flashcards'),
            Tab(text: isFa ? 'درس‌ها' : 'Subjects'),
            Tab(text: isFa ? 'یادداشت' : 'Notes'),
            Tab(text: isFa ? 'آزمون‌ها' : 'Exams'),
          ],
        ),
        const SizedBox(height: 10),
        Expanded(
          child: TabBarView(
            controller: tabs,
            children: [
              FlashcardsView(
                store: widget.store,
                onAdd: addFlashcard,
              ),
              SubjectsView(store: widget.store),
              NotesView(store: widget.store, onAdd: addNote),
              ExamsView(store: widget.store, onAdd: addExam),
            ],
          ),
        ),
      ],
    );
  }
}

class FlashcardsView extends StatelessWidget {
  final RoshdStore store;
  final VoidCallback onAdd;

  const FlashcardsView({
    super.key,
    required this.store,
    required this.onAdd,
  });

  @override
  Widget build(BuildContext context) {
    final isFa = store.lang == 'fa';

    return ListView(
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                isFa ? 'کارت‌های مرور' : 'Review cards',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
            IconButton.filled(
              onPressed: onAdd,
              icon: const Icon(Icons.add_rounded),
            ),
          ],
        ),
        const SizedBox(height: 8),
        if (store.cards.isEmpty)
          EmptyMessage(
            text: isFa
                ? 'هنوز کارت مرور نداری.'
                : 'No flashcards yet.',
          )
        else
          ...store.cards.map(
            (card) => Card(
              child: ExpansionTile(
                title: Text(
                  card.front,
                  style: const TextStyle(
                    fontWeight: FontWeight.w800,
                  ),
                ),
                subtitle: Text(
                  card.deck + ' · ' + card.mastery.toString() + '/5',
                ),
                childrenPadding:
                    const EdgeInsets.fromLTRB(16, 0, 16, 14),
                children: [
                  Align(
                    alignment: AlignmentDirectional.centerStart,
                    child: Text(
                      card.back,
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: [
                      OutlinedButton(
                        onPressed: () => store.rateCard(card, false),
                        child: Text(isFa ? 'دوباره' : 'Again'),
                      ),
                      FilledButton(
                        onPressed: () => store.rateCard(card, true),
                        child: Text(isFa ? 'بلدم' : 'Got it'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}

class SubjectsView extends StatefulWidget {
  final RoshdStore store;
  const SubjectsView({super.key, required this.store});
  @override State<SubjectsView> createState() => _SubjectsViewState();
}

class _SubjectsViewState extends State<SubjectsView> {
  Future<void> addSubject() async {
    final name = TextEditingController();
    final goal = TextEditingController(text: '180');
    var color = 0xff7bf6df;
    const colors = [0xff7bf6df,0xff8a7cff,0xfff4d47c,0xffff8fb1,0xff7ca8ff,0xffffa35c];
    await showDialog(
      context: context,
      builder: (_) => StatefulBuilder(
        builder: (context, set) => AlertDialog(
          title: Text(widget.store.lang == 'fa' ? 'درس جدید' : 'New subject'),
          content: Column(mainAxisSize: MainAxisSize.min, children: [
            TextField(controller: name, decoration: InputDecoration(labelText: widget.store.lang == 'fa' ? 'نام درس' : 'Subject name')),
            const SizedBox(height: 9),
            TextField(controller: goal, keyboardType: TextInputType.number, decoration: InputDecoration(labelText: widget.store.lang == 'fa' ? 'هدف هفتگی (دقیقه)' : 'Weekly goal (minutes)')),
            const SizedBox(height: 9),
            Wrap(spacing: 8, children: colors.map((x) => InkWell(
              onTap: () => set(() => color = x),
              borderRadius: BorderRadius.circular(99),
              child: Container(width: 30, height: 30, decoration: BoxDecoration(
                color: Color(x), shape: BoxShape.circle,
                border: Border.all(color: color == x ? Colors.white : Colors.transparent, width: 3),
              )),
            )).toList()),
          ]),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: Text(widget.store.lang == 'fa' ? 'لغو' : 'Cancel')),
            FilledButton(
              onPressed: () async {
                final n = name.text.trim();
                if (n.isEmpty || widget.store.subjects.any((s) => s.name == n)) return;
                widget.store.subjects.add(SubjectItem(name: n, goal: max(30, int.tryParse(goal.text) ?? 180), color: color));
                await widget.store.save();
                if (mounted) Navigator.pop(context);
              },
              child: Text(widget.store.lang == 'fa' ? 'افزودن' : 'Add'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final fa = widget.store.lang == 'fa';
    return ListView(
      children: [
        Row(children: [
          Expanded(child: Text(fa ? 'درس‌ها و هدف‌ها' : 'Subjects & goals', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w900))),
          IconButton.filled(onPressed: addSubject, icon: const Icon(Icons.add_rounded)),
        ]),
        Text(fa ? 'برای هر درس هدف هفتگی بگذار و با نوار پیشرفت ببین چقدر به آن نزدیک شده‌ای.' : 'Set a weekly goal for each subject and track it with a progress bar.', style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant, height: 1.7)),
        const SizedBox(height: 10),
        ...widget.store.subjects.map((subject) {
          final minutes = widget.store.subjectMinutes(subject.name);
          final progress = subject.goal <= 0 ? 0.0 : min(1.0, minutes / subject.goal);
          return Dismissible(
            key: ValueKey(subject.name),
            background: Container(
              margin: const EdgeInsets.only(bottom: 10),
              decoration: BoxDecoration(color: Colors.red.withOpacity(.08), borderRadius: BorderRadius.circular(22)),
              alignment: AlignmentDirectional.centerEnd,
              padding: const EdgeInsets.all(18),
              child: const Icon(Icons.delete_outline_rounded),
            ),
            onDismissed: (_) { widget.store.subjects.remove(subject); widget.store.save(); },
            child: GlassPanel(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  Container(width: 11, height: 11, decoration: BoxDecoration(color: Color(subject.color), shape: BoxShape.circle)),
                  const SizedBox(width: 8),
                  Expanded(child: Text(subject.name, style: const TextStyle(fontWeight: FontWeight.w900))),
                  Text(minutes.toString() + ' / ' + subject.goal.toString() + ' min'),
                ]),
                const SizedBox(height: 8),
                LinearProgressIndicator(value: progress, color: Color(subject.color), backgroundColor: Color(subject.color).withOpacity(.08), minHeight: 8),
              ]),
            ),
          );
        }),
      ],
    );
  }
}

class NotesView extends StatelessWidget {
  final RoshdStore store;
  final VoidCallback onAdd;

  const NotesView({
    super.key,
    required this.store,
    required this.onAdd,
  });

  @override
  Widget build(BuildContext context) {
    final isFa = store.lang == 'fa';

    return ListView(
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                isFa ? 'یادداشت‌ها' : 'Notes',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
            IconButton.filled(
              onPressed: onAdd,
              icon: const Icon(Icons.add_rounded),
            ),
          ],
        ),
        if (store.notes.isEmpty)
          EmptyMessage(
            text: isFa
                ? 'خلاصه‌ها، فرمول‌ها و نکته‌هایت را اینجا نگه دار.'
                : 'Keep summaries, formulas and quick notes here.',
          )
        else
          ...store.notes.map(
            (note) => Card(
              child: ListTile(
                title: Text(
                  note.title,
                  style: const TextStyle(
                    fontWeight: FontWeight.w800,
                  ),
                ),
                subtitle: Text(
                  note.subject + ' · ' + note.body,
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),
                trailing: Text(timeLabel(note.at)),
              ),
            ),
          ),
      ],
    );
  }
}

class ExamsView extends StatelessWidget {
  final RoshdStore store;
  final VoidCallback onAdd;

  const ExamsView({
    super.key,
    required this.store,
    required this.onAdd,
  });

  @override
  Widget build(BuildContext context) {
    final isFa = store.lang == 'fa';
    final list = [...store.exams]
      ..sort((a, b) => a.at.compareTo(b.at));

    return ListView(
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                isFa ? 'آزمون‌ها' : 'Exams',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
            IconButton.filled(
              onPressed: onAdd,
              icon: const Icon(Icons.add_rounded),
            ),
          ],
        ),
        if (list.isEmpty)
          EmptyMessage(
            text: isFa
                ? 'تاریخ آزمون بعدی را اضافه کن.'
                : 'Add your next exam date.',
          )
        else
          ...list.map(
            (exam) => GlassPanel(
              child: ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(
                  child: Text(
                    max(
                      0,
                      exam.at.difference(DateTime.now()).inDays,
                    ).toString(),
                  ),
                ),
                title: Text(
                  exam.title,
                  style: const TextStyle(
                    fontWeight: FontWeight.w800,
                  ),
                ),
                subtitle: Text(
                  exam.subject + ' · ' + dateLabel(exam.at, store.lang),
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class InsightsPage extends StatelessWidget {
  final RoshdStore store;

  const InsightsPage({super.key, required this.store});

  @override
  Widget build(BuildContext context) {
    final isFa = store.lang == 'fa';
    final weekly = List.generate(
      7,
      (index) {
        final date = DateTime.now().subtract(
          Duration(days: 6 - index),
        );
        return store.sessions
            .where((session) => sameDay(session.at, date))
            .fold<int>(0, (sum, item) => sum + item.minutes);
      },
    );
    final maxY = max(60, (weekly.reduce(max) + 40)).toDouble();

    return ListView(
      children: [
        Text(
          isFa ? 'تحلیل پیشرفت' : 'Insights',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.w900,
          ),
        ),
        const SizedBox(height: 12),
        GridView.count(
          crossAxisCount: MediaQuery.sizeOf(context).width > 900 ? 3 : 1,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
          childAspectRatio: 2.2,
          children: [
            MetricCard(
              icon: Icons.timer_rounded,
              value: store.totalMinutes().toString(),
              label: isFa ? 'کل مطالعه' : 'Total study',
            ),
            MetricCard(
              icon: Icons.auto_graph_rounded,
              value: weekly.fold<int>(0, (a, b) => a + b).toString(),
              label: isFa ? '۷ روز اخیر' : 'Last 7 days',
            ),
            MetricCard(
              icon: Icons.local_fire_department_rounded,
              value: store.streak().toString(),
              label: isFa ? 'زنجیره' : 'Streak',
            ),
          ],
        ),
        const SizedBox(height: 12),
        GlassPanel(
          child: SizedBox(
            height: 300,
            child: BarChart(
              BarChartData(
                maxY: maxY,
                borderData: FlBorderData(show: false),
                gridData: const FlGridData(show: false),
                barGroups: List.generate(
                  7,
                  (index) => BarChartGroupData(
                    x: index,
                    barRods: [
                      BarChartRodData(
                        toY: weekly[index].toDouble(),
                        width: 24,
                        borderRadius: BorderRadius.circular(7),
                        color: Theme.of(context).colorScheme.primary,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
        const SizedBox(height: 12),
        GlassPanel(
          child: Text(
            isFa
                ? 'پیشرفت پایدار از یک برنامهٔ واقعی می‌آید؛ ساعت مطالعهٔ ثابت، مرور کوتاه و استراحت منظم را جدی بگیر.'
                : 'Sustainable progress comes from a realistic routine: fixed study times, short review and regular breaks.',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              height: 1.8,
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ),
        ),
      ],
    );
  }
}

class MorePage extends StatelessWidget {
  final RoshdStore store;
  final SoundLab audio;

  const MorePage({
    super.key,
    required this.store,
    required this.audio,
  });

  Future<void> copyBackup(BuildContext context) async {
    await Clipboard.setData(
      ClipboardData(text: store.backupJson()),
    );
    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          store.lang == 'fa'
              ? 'پشتیبان در کلیپ‌بورد کپی شد.'
              : 'Backup copied to clipboard.',
        ),
      ),
    );
  }

  Future<void> restoreBackup(BuildContext context) async {
    final clip = await Clipboard.getData(Clipboard.kTextPlain);
    final ok = await store.restoreJson(clip?.text ?? '');
    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          ok
              ? (store.lang == 'fa'
                  ? 'بازیابی انجام شد.'
                  : 'Restore complete.')
              : (store.lang == 'fa'
                  ? 'پشتیبان معتبر پیدا نشد.'
                  : 'No valid backup found.'),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isFa = store.lang == 'fa';

    return ListView(
      children: [
        Text(
          isFa ? 'بیشتر و تنظیمات' : 'More & settings',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.w900,
          ),
        ),
        const SizedBox(height: 12),
        GlassPanel(
          child: Column(
            children: [
              ListTile(
                leading: const Icon(Icons.translate_rounded),
                title: Text(isFa ? 'زبان' : 'Language'),
                subtitle: Text(
                  isFa ? 'فارسی · English' : 'English · فارسی',
                ),
                trailing: Switch(
                  value: store.lang == 'en',
                  onChanged: (value) => store.setLang(
                    value ? 'en' : 'fa',
                  ),
                ),
              ),
              ListTile(
                leading: const Icon(Icons.dark_mode_rounded),
                title: Text(isFa ? 'حالت نمایش' : 'Appearance'),
                subtitle: Text(
                  store.mode == ThemeMode.dark
                      ? (isFa ? 'تیره' : 'Dark')
                      : (isFa ? 'روشن' : 'Light'),
                ),
                trailing: Switch(
                  value: store.mode == ThemeMode.dark,
                  onChanged: (value) {
                    store.mode = value
                        ? ThemeMode.dark
                        : ThemeMode.light;
                    store.save();
                  },
                ),
              ),
              ListTile(
                leading: const Icon(Icons.notifications_active_rounded),
                title: Text(isFa ? 'اعلان‌ها' : 'Notifications'),
                trailing: Switch(
                  value: store.notifications,
                  onChanged: (value) {
                    store.notifications = value;
                    store.save();
                    if (value) {
                      Notify.requestPermissions();
                    }
                  },
                ),
              ),
              ListTile(
                leading: const Icon(Icons.volume_up_rounded),
                title: Text(
                  isFa ? 'صداهای مطالعه' : 'Study sounds',
                ),
                trailing: Switch(
                  value: store.sounds,
                  onChanged: (value) {
                    store.sounds = value;
                    store.save();
                    if (!value) audio.stop();
                  },
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        GlassPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              PanelHeader(
                title: isFa ? 'هدف روزانه' : 'Daily goal',
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: [60, 90, 120, 180, 240, 300]
                    .map(
                      (value) => ChoiceChip(
                        selected: store.dailyGoal == value,
                        label: Text(value.toString()),
                        onSelected: (_) {
                          store.dailyGoal = value;
                          store.save();
                        },
                      ),
                    )
                    .toList(),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        GlassPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              PanelHeader(
                title: isFa ? 'فضای ظاهری' : 'Visual mood',
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  MoodChip(
                    label: isFa ? 'آرورا' : 'Aurora',
                    value: 'aurora',
                    colors: const [
                      Color(0xff6d8cff),
                      Color(0xff7bf6df),
                    ],
                    store: store,
                  ),
                  MoodChip(
                    label: isFa ? 'بنفش شب' : 'Night Violet',
                    value: 'violet',
                    colors: const [
                      Color(0xff8a7cff),
                      Color(0xffff8fb1),
                    ],
                    store: store,
                  ),
                  MoodChip(
                    label: isFa ? 'طلایی' : 'Golden',
                    value: 'gold',
                    colors: const [
                      Color(0xffd9b55d),
                      Color(0xffffa35c),
                    ],
                    store: store,
                  ),
                  MoodChip(
                    label: isFa ? 'نعنایی' : 'Mint',
                    value: 'mint',
                    colors: const [
                      Color(0xff7bf6df),
                      Color(0xff7ca8ff),
                    ],
                    store: store,
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        GlassPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              PanelHeader(
                title: isFa ? 'پشتیبان‌گیری' : 'Backup',
              ),
              Text(
                isFa
                    ? 'JSON پشتیبان را کپی کن تا داده‌ها را بین دستگاه‌ها جابه‌جا کنی.'
                    : 'Copy a JSON backup to move local study data between devices.',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color:
                      Theme.of(context).colorScheme.onSurfaceVariant,
                  height: 1.7,
                ),
              ),
              const SizedBox(height: 10),
              Wrap(
                spacing: 8,
                children: [
                  FilledButton.icon(
                    onPressed: () => copyBackup(context),
                    icon: const Icon(Icons.copy_all_rounded),
                    label: Text(
                      isFa ? 'کپی پشتیبان' : 'Copy backup',
                    ),
                  ),
                  OutlinedButton.icon(
                    onPressed: () => restoreBackup(context),
                    icon: const Icon(Icons.restore_rounded),
                    label: Text(
                      isFa ? 'بازیابی' : 'Restore',
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        GlassPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Pill(
                text: 'AdLand Studio',
                icon: Icons.auto_awesome_rounded,
              ),
              const SizedBox(height: 10),
              Text(
                isFa
                    ? 'Roshd محصول AdLand Studio است؛ فارسی در مرکز تجربه قرار دارد و English گزینهٔ دوم است.'
                    : 'Roshd is a product of AdLand Studio, with Persian first and English second.',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  height: 1.8,
                  color:
                      Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class MoodChip extends StatelessWidget {
  final String label;
  final String value;
  final List<Color> colors;
  final RoshdStore store;

  const MoodChip({
    super.key,
    required this.label,
    required this.value,
    required this.colors,
    required this.store,
  });

  @override
  Widget build(BuildContext context) {
    final active = store.accent == value;

    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: () {
        store.accent = value;
        store.save();
      },
      child: Container(
        width: 130,
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: active
                ? Theme.of(context).colorScheme.primary
                : Theme.of(context)
                    .colorScheme
                    .outlineVariant
                    .withOpacity(.25),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 8,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                gradient: LinearGradient(colors: colors),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.w800),
            ),
            if (active)
              Text(
                '✓',
                style: TextStyle(
                  color: Theme.of(context).colorScheme.primary,
                  fontWeight: FontWeight.w900,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
