import 'package:ente_auth/l10n/l10n.dart';
import 'package:ente_auth/models/account/two_factor.dart';
import 'package:ente_auth/services/user_service.dart';
import 'package:ente_auth/ui/lifecycle_event_handler.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'package:pinput/pinput.dart';

class TwoFactorAuthenticationPage extends StatefulWidget {
  final String sessionID;

  const TwoFactorAuthenticationPage(this.sessionID, {super.key});

  @override
  State<TwoFactorAuthenticationPage> createState() =>
      _TwoFactorAuthenticationPageState();
}

class _TwoFactorAuthenticationPageState
    extends State<TwoFactorAuthenticationPage> {
  final _pinController = TextEditingController();
  String _code = "";
  late LifecycleEventHandler _lifecycleEventHandler;

  @override
  void initState() {
    _lifecycleEventHandler = LifecycleEventHandler(
      resumeCallBack: () async {
        if (mounted) {
          final data = await Clipboard.getData(Clipboard.kTextPlain);
          if (data != null && data.text != null && data.text!.length == 6) {
            _pinController.text = data.text!;
          }
        }
      },
    );
    WidgetsBinding.instance.addObserver(_lifecycleEventHandler);
    super.initState();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(_lifecycleEventHandler);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return Scaffold(
      appBar: AppBar(
        title: Text(
          l10n.twoFactorAuthTitle,
        ),
      ),
      body: _getBody(),
    );
  }

  Widget _getBody() {
    final l10n = context.l10n;
    final pinPutDecoration = BoxDecoration(
      border: Border.all(
        color: Theme.of(context)
            .inputDecorationTheme
            .focusedBorder!
            .borderSide
            .color,
      ),
      borderRadius: BorderRadius.circular(15.0),
    );
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisAlignment: MainAxisAlignment.center,
      mainAxisSize: MainAxisSize.max,
      children: [
        Text(
          l10n.enterCodeHint,
          style: const TextStyle(
            height: 1.4,
            fontSize: 16,
          ),
          textAlign: TextAlign.center,
        ),
        const Padding(padding: EdgeInsets.all(32)),
        Padding(
          padding: const EdgeInsets.fromLTRB(40, 0, 40, 0),
          child: Pinput(
            onSubmitted: (String code) {
              _verifyTwoFactorCode(code);
            },
            length: 6,
            defaultPinTheme: const PinTheme(),
            submittedPinTheme: PinTheme(
              decoration: pinPutDecoration.copyWith(
                borderRadius: BorderRadius.circular(20.0),
              ),
            ),
            focusedPinTheme: PinTheme(
              decoration: pinPutDecoration,
            ),
            followingPinTheme: PinTheme(
              decoration: pinPutDecoration.copyWith(
                borderRadius: BorderRadius.circular(5.0),
              ),
            ),
            onChanged: (String pin) {
              setState(() {
                _code = pin;
              });
            },
            controller: _pinController,
            autofocus: true,
          ),
        ),
        const Padding(padding: EdgeInsets.all(24)),
        Container(
          padding: const EdgeInsets.fromLTRB(80, 0, 80, 0),
          width: double.infinity,
          height: 64,
          child: OutlinedButton(
            onPressed: _code.length == 6
                ? () async {
                    await _verifyTwoFactorCode(_code);
                  }
                : null,
            child: Text(l10n.verify),
          ),
        ),
        const Padding(padding: EdgeInsets.all(30)),
        GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: () {
            UserService.instance.recoverTwoFactor(
              context,
              widget.sessionID,
              TwoFactorType.totp,
            );
          },
          child: Container(
            padding: const EdgeInsets.all(10),
            child: Center(
              child: Text(
                l10n.lostDeviceTitle,
                style: const TextStyle(
                  decoration: TextDecoration.underline,
                  fontSize: 12,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Future<void> _verifyTwoFactorCode(String code) async {
    await UserService.instance.verifyTwoFactor(context, widget.sessionID, code);
  }
}
